package services

import (
	"log"
	"net/http"
	"wedding/models"
	"wedding/repositories"

	"github.com/gin-gonic/gin"
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

func (s *Services) UserCreateRepoError(err error, r *repositories.Repo, u *models.User, c *gin.Context) {
	if deleteErr := r.DeleteUser(u); deleteErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": deleteErr.Error()})
		log.Println(deleteErr.Error())
	}
	c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	log.Println(err.Error())
}
