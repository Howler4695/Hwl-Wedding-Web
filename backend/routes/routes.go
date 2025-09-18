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
	// r.Router.GET("/user/get_user/:user_id", GetUserById)
	// r.Router.POST("/user/create_user/:user_id", CreateUser)
	// r.Router.PATCH("/user/update", controller.UpdateUser)
}
