package repositories

import (
	"context"
	"wedding/models"

	"github.com/jackc/pgx/v5"
)

func (r *Repo) UpdateParty(p *models.Party) (*models.Party, error) {
	row, err := r.PgPool.Query(context.Background(), "insert into party(fk_user_id, attending, note) values($1, $2, $3) on conflict (fk_user_id) do update set attending = excluded.attending, note = excluded.note returning *", p.UserId, p.Attending, p.Note)
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

func (r *Repo) UpdatePartyPop(pops *[]models.PartyPop) error {
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
