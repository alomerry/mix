package controller

import (
	"context"
	"github.com/gin-gonic/gin"
	"gw/proto"
	"net/http"
)

func init() {
	initRouter()
}

func initRouter() {
	registerRouter(Version0, func(v0 *gin.RouterGroup) {
		v0.Any("/mix/*rest", gin.WrapH(genGatewayHandler()))
	})
}

func genGatewayHandler() http.Handler {
	ctx := context.Background()
	gateway, err := proto.NewGateway(ctx)
	if err != nil {
		panic(err)
	}
	return gateway
}
