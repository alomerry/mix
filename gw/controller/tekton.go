package controller

import (
	"github.com/gin-gonic/gin"
)

func init() {
	registerRouter(Version0, func(v0 *gin.RouterGroup) {
		var (
			tekton   = v0.Group("/tekton")
			pipeline = tekton.Group("/pipeline")
		)

		pipeline.POST("/trigger", triggerPipelineRun)
	})
}

func triggerPipelineRun(c *gin.Context) {

}
