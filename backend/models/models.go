package models

import "github.com/google/uuid"

type User struct {
	Id        uuid.UUID `db:"user_id"`
	FirstName string    `db:"first_name"`
	LastName  string    `db:"last_name"`
}

type Address struct {
	Id      int       `db:"address_id"`
	UserId  uuid.UUID `db:"fk_user_id"`
	LineOne string    `db:"address_line_one"`
	LineTwo string    `db:"address_line_two"`
	State   string    `db:"state"`
	City    string    `db:"city"`
	ZipCode string    `db:"zip_code"`
}

type Contact struct {
	Id          int       `db:"contact_id"`
	UserId      uuid.UUID `db:"fk_user_id"`
	Email       string    `db:"email"`
	PhoneNumber string    `db:"phone_number"`
}

type PlusOne struct {
	Id        int       `db:"plus_one_id"`
	UserId    uuid.UUID `db:"fk_user_id"`
	FirstName string    `db:"first_name"`
	LastName  string    `db:"last_name"`
}

type Attendance struct {
	Id        int       `db:"attendance_id"`
	UserId    uuid.UUID `db:"fk_user_id"`
	Attending bool      `db:"attending"`
}
