package services

import (
	"wedding/models"

	"github.com/google/uuid"
)

type Services struct {
}

func (s *Services) ConvertPlusOnes(dtoPlusOnes []models.PlusOneName, userId uuid.UUID) []models.PlusOne {
	plusOnes := make([]models.PlusOne, len(dtoPlusOnes))
	for i, p := range dtoPlusOnes {
		plusOnes[i] = models.PlusOne{
			UserId:    userId,
			FirstName: p.FirstName,
			LastName:  p.LastName,
		}
	}
	return plusOnes
}
