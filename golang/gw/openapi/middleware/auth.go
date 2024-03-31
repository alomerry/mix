package middleware

import (
	"context"
	"github.com/alomerry/go-tools/utils/array"
	"github.com/gin-gonic/gin"
	"gw/core/components/token"
	"net/http"
)

var (
	NoAuthRoutes = []string{
		"/ping",
		"/v0/mix/admin/login",
		"/v0/mix/admin/token/refresh",
		"/v0/mix/blog/search",
	}
)

func Auth() gin.HandlerFunc {
	return func(c *gin.Context) {
		jwt := getTokenFromHeader(c)
		path := c.Request.URL.Path

		if array.Contains(NoAuthRoutes, path) {
			c.Next() // TODO
			return
		}

		_, err := token.CTool.ExtractToken(context.Background(), jwt)
		if err != nil {
			c.JSON(http.StatusForbidden, struct {
				Msg string
			}{err.Error()})
			c.Abort()
			return
		}
		// 设置 header
		// fmt.Println(claims.Username, claims.Version)
		c.Next()
		return
	}
}

// TODO go-tools
func getTokenFromHeader(c *gin.Context) string {
	const tokenKey = "X-Access-Token"
	token := c.GetHeader(tokenKey)
	if token != "" {
		return token
	}
	return ""
}
