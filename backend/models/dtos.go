package models

type PlusOneName struct {
	FirstName string `json: "firstname"`
	LastName  string `json: "lastname"`
}

type UserCreateDTO struct {
	FirstName      string        `json:"firstname"`
	LastName       string        `json:"lastname"`
	AddressLineOne string        `json:"address_line_one"`
	AddressLineTwo string        `json:"address_line_two"`
	City           string        `json:"city"`
	State          string        `json:"state"`
	Zip            string        `json:"zip"`
	Email          string        `json:"email"`
	PhoneNumber    string        `json:"phone_number"`
	NumberPlusOnes int           `json:"number_plusones"`
	PlusOnes       []PlusOneName `json:"plusones"`
	Notes          string        `json:"notes"`
}
