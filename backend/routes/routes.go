package routes

import (
	"wedding/controller"

	"github.com/gin-gonic/gin"
)

type Routes struct {
	Router *gin.Engine
	Cont   *controller.Controller
}

func (r *Routes) MapAllRoutes() {
	r.mapUserRoutes()
}

func (r *Routes) mapUserRoutes() {
	r.Router.GET("/user/:user_id", r.Cont.GetUserInfo)
	r.Router.GET("/user/contact/:user_id", r.Cont.GetUserContactInfo)
	r.Router.GET("/party/pops/:user_id", r.Cont.GetPartyPops)
	r.Router.GET("/party/:user_id", r.Cont.GetParty)
	r.Router.POST("/user/create", r.Cont.CreateUserInitial)
	r.Router.POST("/party/update/:user_id", r.Cont.UpdateParty)
	// r.Router.PATCH("/user/update", controller.UpdateUser)
}
