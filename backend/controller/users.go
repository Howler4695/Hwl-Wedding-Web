package controller

import (
	"log"
	"net/http"
	"wedding/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (ct *Controller) GetUserInfo(c *gin.Context) {
	userId := c.Param("user_id")

	user, err := ct.Repo.GetUser(userId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, &user)

}

func (ct *Controller) GetUserContactInfo(c *gin.Context) {
	userId := c.Param("user_id")

	contacts, err := ct.Repo.GetUserContacts(userId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, &contacts)
}

func (ct *Controller) CreateUserInitial(c *gin.Context) {
	newUser := &models.UserCreateDTO{}

	if err := c.ShouldBindJSON(&newUser); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Println(err.Error())
		return
	}

	newId := uuid.New()
	mNewUser := models.User{Id: newId, FirstName: newUser.FirstName, LastName: newUser.LastName}
	mNewContact := models.Contact{UserId: newId, Email: newUser.Email, PhoneNumber: newUser.PhoneNumber}
	mNewAddress := models.Address{UserId: newId, LineOne: newUser.AddressLineOne, LineTwo: newUser.AddressLineTwo, City: newUser.City, State: newUser.State, ZipCode: newUser.Zip}
	mPlusOnes := ct.Services.ConvertPlusOnes(newUser.PlusOnes, newId)
	mAttendance := models.Attendance{UserId: newId, Attending: newUser.Attending}

	if err := ct.Repo.CreateUser(&mNewUser); err != nil {
		ct.Services.UserCreateRepoError(err, ct.Repo, &mNewUser, c)
		return
	}

	if err := ct.Repo.CreateAttendance(&mAttendance); err != nil {
		ct.Services.UserCreateRepoError(err, ct.Repo, &mNewUser, c)
		return
	}

	if newUser.Attending == false {
		c.Status(http.StatusOK)
		return
	}

	if err := ct.Repo.CreateContact(&mNewContact); err != nil {
		ct.Services.UserCreateRepoError(err, ct.Repo, &mNewUser, c)
		return
	}

	if err := ct.Repo.CreateAddress(&mNewAddress); err != nil {
		ct.Services.UserCreateRepoError(err, ct.Repo, &mNewUser, c)
		return
	}

	if err := ct.Repo.CreatePlusOnes(&mPlusOnes); err != nil {
		ct.Services.UserCreateRepoError(err, ct.Repo, &mNewUser, c)
		return
	}

	c.Status(http.StatusOK)
}
