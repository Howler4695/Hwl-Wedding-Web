package repositories

import (
	"context"
	"wedding/models"

	"github.com/jackc/pgx/v5"
)

func (r *Repo) GetUser(userId string) (*models.User, error) {
	row, err := r.PgPool.Query(context.Background(), "select * from users where user_id=$1", userId)
	user, err := pgx.CollectExactlyOneRow(row, pgx.RowToStructByName[models.User])

	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (r *Repo) CreateUser(u *models.User) error {
	_, err := r.PgPool.Exec(context.Background(), "insert into users(user_id, first_name, last_name, notes) values($1, $2, $3, $4)", u.Id, u.FirstName, u.LastName, u.Notes)

	if err != nil {
		return err
	}

	return nil
}

func (r *Repo) CreateAddress(a *models.Address) error {
	_, err := r.PgPool.Exec(context.Background(), "insert into addresses(fk_user_id, address_line_one, address_line_two, city, state, zip_code) values($1, $2, $3, $4, $5, $6)", a.UserId, a.LineOne, a.LineTwo, a.City, a.State, a.ZipCode)

	if err != nil {
		return err
	}

	return nil
}

func (r *Repo) CreateContact(c *models.Contact) error {
	_, err := r.PgPool.Exec(context.Background(), "insert into contacts(fk_user_id, email, phone_number) values($1, $2, $3)", c.UserId, c.Email, c.PhoneNumber)

	if err != nil {
		return err
	}

	return nil
}

func (r *Repo) CreateAttendance(a *models.Attendance) error {
	_, err := r.PgPool.Exec(context.Background(), "insert into attendance(fk_user_id, attending) values($1, $2)", a.UserId, a.Attending)

	if err != nil {
		return err
	}

	return nil
}

func (r *Repo) CreatePlusOnes(plusOnes *[]models.PlusOne) error {
	plusOneRows := make([][]interface{}, len(*plusOnes))
	for i, po := range *plusOnes {
		plusOneRows[i] = []interface{}{po.UserId, po.FirstName, po.LastName}
	}
	_, err := r.PgPool.CopyFrom(context.Background(), pgx.Identifier{"plus_one"}, []string{"fk_user_id", "first_name", "last_name"}, pgx.CopyFromRows(plusOneRows))

	if err != nil {
		return err
	}

	return nil
}

func (r *Repo) DeleteUser(u *models.User) error {
	_, err := r.PgPool.Exec(context.Background(), "delete from users where user_id = $1", u.Id)

	if err != nil {
		return err
	}

	return nil
}
