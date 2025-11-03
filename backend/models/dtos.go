package models

type PlusOneName struct {
	FirstName string `json: "firstname"`
	LastName  string `json: "lastname"`
}

type UserCreateDTO struct {
	NumberPlusOnes int           `json:"number_plusones"`
	Attending      bool          `json:"attending"`
	FirstName      string        `json:"firstname"`
	LastName       string        `json:"lastname"`
	AddressLineOne string        `json:"address_line_one"`
	AddressLineTwo string        `json:"address_line_two"`
	City           string        `json:"city"`
	State          string        `json:"state"`
	Zip            string        `json:"zip"`
	Email          string        `json:"email"`
	PhoneNumber    string        `json:"phone_number"`
	Notes          string        `json:"notes"`
	PlusOnes       []PlusOneName `json:"plusones"`
}

type PartyDTO struct {
	Attending bool           `json:"attending"`
	Note      *string        `json:"note,omitempty"`
	Pop       *[]PartyPeople `json:"party_people"`
}

type PartyPeople struct {
	ID          string  `json:"id"`
	Age         int     `json:"age"`
	FirstName   string  `json:"first_name"`
	LastName    string  `json:"last_name"`
	PhoneNumber *string `json:"phone_number"`
	Allergies   *string `json:"allergies"`
}
