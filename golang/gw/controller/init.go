package controller

import (
	"fmt"
	"github.com/gin-gonic/gin"
)

const (
	Version0 = "v0"
)

var (
	versions = []string{Version0}

	routerGroupMapper = map[string][]func(*gin.RouterGroup){}
)

func InitRouter(engine *gin.Engine) {
	engine.GET("/ping", ping)

	for _, version := range versions {
		vg := engine.Group(fmt.Sprintf("/%s", version))
		for _, vGroupFunc := range routerGroupMapper[version] {
			vGroupFunc(vg)
		}
	}
}

type Handler func(c *gin.Context) (any, error)

func HandlerFuncWrapper(handler Handler) gin.HandlerFunc {
	return func(c *gin.Context) {
		//resp, err := handler(c)
	}
}

func registerRouter(version string, routerFunc func(*gin.RouterGroup)) {
	_, exits := routerGroupMapper[version]
	if !exits {
		routerGroupMapper[version] = make([]func(*gin.RouterGroup), 0)
	}

	routerGroupMapper[version] = append(routerGroupMapper[version], routerFunc)
}
