package controller

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func ping(c *gin.Context) {
	c.Status(http.StatusOK)
}
