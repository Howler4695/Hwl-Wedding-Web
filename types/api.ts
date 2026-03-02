// Matches Go User struct (no json tags — uses Go field names)
export interface User {
  Id: string;
  FirstName: string;
  LastName: string;
}

// Matches Go Party struct
export interface Party {
  id: number;
  userId: string;
  attending?: boolean;
  notes?: string;
}

// Matches Go PartyPop struct
export interface PartyPop {
  id: string;
  partyId: number;
  age: number;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  allergies?: string;
}

// Matches Go UserDTO (admin)
export interface UserDTO {
  first_name?: string;
  last_name?: string;
  address?: string;
  phone_number?: string;
  email?: string;
}

// Matches Go PartyPeople (admin)
export interface PartyPeople {
  id: string;
  age: number;
  first_name: string;
  last_name: string;
  phone_number?: string;
  allergies?: string;
}

// Matches Go PartyDTO (admin)
export interface PartyDTO {
  party_id: number;
  attending?: boolean;
  notes?: string;
  owning_user?: UserDTO;
  people_to_remove?: string[];
  party_people?: PartyPeople[];
}
