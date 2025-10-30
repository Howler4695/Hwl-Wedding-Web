package controller

import (
	"log"
	"net/http"
	"wedding/models"

	"github.com/gin-gonic/gin"
)

func (ct *Controller) UpdateParty(c *gin.Context) {
	userId := c.Param("user_id")

	newPartyInfo := &models.PartyDTO{}

	if err := c.ShouldBindJSON(&newPartyInfo); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Println(err.Error())
		return
	}

	mParty := models.Party{UserId: userId, Attending: newPartyInfo.Attending, Note: newPartyInfo.Note}

	newParty, err := ct.Repo.UpdateParty(&mParty)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	mPops := []models.PartyPop{}
	for _, members := range *newPartyInfo.Pop {
		mPops = append(mPops, models.PartyPop{PartyId: newParty.ID, FirstName: members.FirstName, LastName: members.LastName, Age: members.Age, PhoneNumber: members.PhoneNumber, Allergies: members.Allergies})
	}
	if err := ct.Repo.UpdatePartyPop(&mPops); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Println(err.Error())
		return
	}

	c.JSON(http.StatusOK, gin.H{"body": "ok"})
}

func (ct *Controller) GetPartyPops(c *gin.Context) {
	userId := c.Param("user_id")

	partyPops, err := ct.Repo.GetPartyPopByUserId(userId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Println(err.Error())
		return
	}
	c.JSON(http.StatusOK, &partyPops)
}
