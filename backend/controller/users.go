package controller

import (
	"fmt"
	"net/http"
	"wedding/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (ct *Controller) CreateUserInitial(c *gin.Context) {
	newUser := &models.UserCreateDTO{}

	if err := c.ShouldBindJSON(&newUser); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		fmt.Println(err.Error())
		return
	}

	newId := uuid.New()
	mNewUser := models.User{Id: newId, FirstName: newUser.FirstName, LastName: newUser.LastName, Notes: newUser.Notes}
	mNewContact := models.Contact{UserId: newId, Email: newUser.Email, PhoneNumber: newUser.PhoneNumber}
	mNewAddress := models.Address{UserId: newId, LineOne: newUser.AddressLineOne, LineTwo: newUser.AddressLineTwo, City: newUser.City, State: newUser.State, ZipCode: newUser.Zip}
	mPlusOnes := ct.Services.ConvertPlusOnes(newUser.PlusOnes, newId)

	if err := ct.Repo.CreateUser(&mNewUser); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err.Error())
		return
	}

	if err := ct.Repo.CreateContact(&mNewContact); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err.Error())
		return
	}

	if err := ct.Repo.CreateAddress(&mNewAddress); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err.Error())
		return
	}

	if err := ct.Repo.CreatePlusOnes(&mPlusOnes); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err.Error())
		return
	}

	c.Status(http.StatusOK)
}
