package controller

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
)

const (
	Version0 = "v0"
)

var (
	versions = []string{Version0}

	routerGroupMapper = map[string][]func(*gin.RouterGroup){}
)

type Handler func(c *gin.Context) (any, error)

func InitRouter(engine *gin.Engine) {
	engine.GET("/ping", ping)

	for _, version := range versions {
		vg := engine.Group(fmt.Sprintf("/%s", version))
		for _, vGroupFunc := range routerGroupMapper[version] {
			vGroupFunc(vg)
		}
	}
}

func registerRouter(version string, routerFunc func(*gin.RouterGroup)) {
	_, exits := routerGroupMapper[version]
	if !exits {
		routerGroupMapper[version] = make([]func(*gin.RouterGroup), 0)
	}

	routerGroupMapper[version] = append(routerGroupMapper[version], routerFunc)
}

func ping(c *gin.Context) {
	c.String(http.StatusOK, "%s", "pong")
}
