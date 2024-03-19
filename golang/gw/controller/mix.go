package controller

import (
	"github.com/gin-gonic/gin"
	"gw/controller/internal"
)

func init() {
	initRouter()

}

func initRouter() {
	registerRouter(Version0, func(v0 *gin.RouterGroup) {
		var (
			mix = v0.Group("/mix")
		)
		internal.IKubernetesController.Register(mix.Group("/k8s"))
		internal.IBlogController.Register(mix.Group("/blog"))
	})
}
