package repositories

import (
	"context"
	"wedding/models"

	"github.com/jackc/pgx/v5"
)

func derefString(s *string) string {
	if s == nil {
		return ""
	}
	return *s
}

func (r *Repo) GetAllPartyInfo() (*[]models.PartyDTO, error) {
	const q = `
        -- use the SQL from above, same column order
        SELECT
            p.party_id,
            p.attending,
            p.note,
            u.user_id,
            u.first_name          AS user_first_name,
            u.last_name           AS user_last_name,
            (
                COALESCE(a.address_line_one, '') ||
                CASE WHEN a.address_line_two IS NOT NULL AND a.address_line_two <> '' 
                     THEN ' ' || a.address_line_two ELSE '' END ||
                CASE WHEN a.city IS NOT NULL AND a.city <> '' 
                     THEN ', ' || a.city ELSE '' END ||
                CASE WHEN a.state IS NOT NULL AND a.state <> '' 
                     THEN ', ' || a.state ELSE '' END ||
                CASE WHEN a.zip_code IS NOT NULL AND a.zip_code <> '' 
                     THEN ' ' || a.zip_code ELSE '' END
            ) AS address,
            c.email,
            c.phone_number        AS user_phone_number,
            pp.party_pop_id       AS party_pop_id,
            pp.first_name         AS pop_first_name,
            pp.last_name          AS pop_last_name,
            pp.age                AS pop_age,
            pp.phone_number       AS pop_phone_number,
            pp.allergies          AS pop_allergies
        FROM party p
        JOIN users u
            ON u.user_id = p.fk_user_id
        LEFT JOIN addresses a
            ON a.fk_user_id = u.user_id
        LEFT JOIN contacts c
            ON c.fk_user_id = u.user_id
        LEFT JOIN party_pop pp
            ON pp.fk_party_id = p.party_id
        ORDER BY p.party_id, pp.last_name, pp.first_name;
    `
	rows, err := r.PgPool.Query(context.Background(), q)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	parties := make(map[int]*models.PartyDTO)

	for rows.Next() {
		var (
			partyID   int
			attending *bool
			note      *string
			userID    string
			userFirst *string
			userLast  *string
			address   *string
			email     *string
			userPhone *string

			popID        *string
			popFirst     *string
			popLast      *string
			popAge       *int
			popPhone     *string
			popAllergies *string
		)

		err := rows.Scan(
			&partyID,
			&attending,
			&note,
			&userID,
			&userFirst,
			&userLast,
			&address,
			&email,
			&userPhone,
			&popID,
			&popFirst,
			&popLast,
			&popAge,
			&popPhone,
			&popAllergies,
		)
		if err != nil {
			return nil, err
		}

		// Get or create PartyDTO for this partyID
		p, ok := parties[partyID]
		if !ok {
			p = &models.PartyDTO{
				ID:        partyID,
				Attending: attending,
				Note:      note,
				User: &models.UserDTO{
					FirstName:   userFirst,
					LastName:    userLast,
					Address:     address,
					PhoneNumber: userPhone,
					Email:       email,
				},
				Pop: &[]models.PartyPeople{},
			}

			parties[partyID] = p
		}

		// If there is a party_pop row, append it
		if popID != nil {
			pp := models.PartyPeople{
				ID:        *popID,
				Age:       int(*popAge),
				FirstName: derefString(popFirst),
				LastName:  derefString(popLast),
			}
			if popPhone != nil {
				pp.PhoneNumber = popPhone
			}
			if popAllergies != nil {
				pp.Allergies = popAllergies
			}

			slice := append(*p.Pop, pp)
			p.Pop = &slice
		}
	}

	if rows.Err() != nil {
		return nil, rows.Err()
	}

	// Flatten map → slice
	out := make([]models.PartyDTO, 0, len(parties))
	for _, p := range parties {
		out = append(out, *p)
	}

	return &out, nil

}

func (r *Repo) GetAllPartyPops() (*[]models.PartyPop, error) {
	rows, err := r.PgPool.Query(context.Background(), "SELECT * FROM party_pop")
	partyPops, err := pgx.CollectRows(rows, pgx.RowToStructByName[models.PartyPop])

	if err != nil {
		return nil, err
	}

	return &partyPops, err
}

func (r *Repo) GetAllParties() (*[]models.Party, error) {
	rows, err := r.PgPool.Query(context.Background(), "SELECT * FROM party")
	parties, err := pgx.CollectRows(rows, pgx.RowToStructByName[models.Party])

	if err != nil {
		return nil, err
	}

	return &parties, err
}

const updatePartyQuery = `
INSERT INTO party (fk_user_id, attending, note)
VALUES ($1, $2, $3)
ON CONFLICT (fk_user_id) DO UPDATE
SET
  attending = COALESCE(EXCLUDED.attending, party.attending),
  note      = COALESCE(EXCLUDED.note,      party.note)
RETURNING *;
`

func (r *Repo) UpdateParty(p *models.Party) (*models.Party, error) {
	row, err := r.PgPool.Query(context.Background(), updatePartyQuery, p.UserId, p.Attending, p.Note)
	party, err := pgx.CollectExactlyOneRow(row, pgx.RowToStructByName[models.Party])

	if err != nil {
		return nil, err
	}

	return &party, nil
}

func (r *Repo) nilPointerCheckStr(ptr *string) string {
	if ptr == nil {
		return ""
	}
	return *ptr
}

const deletePopsQuery = `
		DELETE FROM party_pop
		WHERE party_pop_id = ANY($1::uuid[])
	`

func (r *Repo) DeletePartyPops(popIds *[]string) error {
	if popIds == nil {
		return nil
	}
	if len(*popIds) == 0 {
		return nil
	}

	_, err := r.PgPool.Exec(context.Background(), deletePopsQuery, *popIds)
	if err != nil {
		return err
	}
	return nil
}

func (r *Repo) UpdatePartyPop(pops *[]models.PartyPop) error {
	if pops == nil {
		return nil
	}
	if len(*pops) == 0 {
		return nil
	}
	// popRows := make([][]interface{}, len(*pops))
	// for i, a := range *pops {
	// 	phoneNumber := r.nilPointerCheckStr(a.PhoneNumber)
	// 	allergies := r.nilPointerCheckStr(a.Allergies)
	// 	popRows[i] = []interface{}{a.PartyId, a.FirstName, a.LastName, a.Age, phoneNumber, allergies}
	// }

	// _, err := r.PgPool.CopyFrom(context.Background(), pgx.Identifier{"party_pop"}, []string{"fk_party_id", "first_name", "last_name", "age", "phone_number", "allergies"}, pgx.CopyFromRows(popRows))
	// if err != nil {
	var overErr error
	for _, p := range *pops {
		_, err := r.PgPool.Exec(context.Background(), "insert into party_pop(party_pop_id, fk_party_id, first_name, last_name, age, phone_number, allergies) values($1, $2, $3, $4, $5, $6, $7) on conflict (party_pop_id) do update set first_name = excluded.first_name, last_name = excluded.last_name, age = excluded.age, phone_number = excluded.phone_number, allergies = excluded.allergies", p.ID, p.PartyId, p.FirstName, p.LastName, p.Age, p.PhoneNumber, p.Allergies)
		if err != nil {
			overErr = err
		}

	}
	if overErr != nil {
		return overErr
	}

	// }

	return nil
}

const getPartyPopByUserIdQuery string = `
	SELECT pp.*
	FROM party_pop AS pp
	WHERE pp.fk_party_id = (
	  SELECT party_id FROM party WHERE fk_user_id = $1
	)
`

func (r *Repo) GetPartyPopByUserId(userId string) (*[]models.PartyPop, error) {
	rows, err := r.PgPool.Query(context.Background(), getPartyPopByUserIdQuery, userId)
	partyPop, err := pgx.CollectRows(rows, pgx.RowToStructByName[models.PartyPop])
	if err != nil {
		return nil, err
	}
	return &partyPop, nil
}

func (r *Repo) GetPartyByUserId(userId string) (*models.Party, error) {
	row, err := r.PgPool.Query(context.Background(), "select * from party as p where p.fk_user_id = $1", userId)
	party, err := pgx.CollectExactlyOneRow(row, pgx.RowToStructByName[models.Party])
	if err != nil {
		return nil, err
	}
	return &party, nil
}
