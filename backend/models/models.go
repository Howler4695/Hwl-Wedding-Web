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

type Party struct {
	ID        int     `db:"party_id" json:"id"`
	UserId    string  `db:"fk_user_id" json:"userId"`
	Attending *bool   `db:"attending" json:"attending"`
	Note      *string `db:"note" json:"notes"`
}

type PartyPop struct {
	ID          string  `db:"party_pop_id" json:"id"`
	PartyId     int     `db:"fk_party_id" json:"partyId"`
	Age         int     `db:"age" json:"age"`
	FirstName   string  `db:"first_name" json:"firstName"`
	LastName    string  `db:"last_name" json:"lastName"`
	PhoneNumber *string `db:"phone_number" json:"phoneNumber"`
	Allergies   *string `db:"allergies" json:"allergies"`
}
