package controller

import (
	"wedding/repositories"
	"wedding/services"
)

type Controller struct {
	Repo     *repositories.Repo
	Services *services.Services
}
