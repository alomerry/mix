package middleware

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"strings"
)

var (
	allowMethods = []string{"PUT", "POST", "DELETE", "GET", "PATCH", "OPTIONS"}

	allowHeaders = []string{
		"Accept",
		"Sec-Fetch-Dest",
		"Sec-Fetch-Mode",
		"Sec-Fetch-Site",
		"User-Agent",
		"Content-Type",
		"Origin",
		"Referer",
		"Authorization",
		"Content-Type",
		"If-Match",
		"If-Modified-Since",
		"If-None-Match",
		"If-Unmodified-Since",
		"X-QCRM-OTP",
		"X-Requested-With",
		"Accept",
		"Origin",
		"X-Access-Token",
		"X-Account-Id",
		"X-Req-Id",
		"X-Request-Id",
	}
	safeDomains = []string{
		"https://blog.alomerry.com",
		"https://admin.alomerry.com",
		"https://mix-gw.alomerry.com",
		"https://kibana.alomerry.com",
		"https://grafana.alomerry.com",
		"https://influxdb.alomerry.com",
		"https://it-tools.alomerry.com",
		"https://ref.alomerry.com",
	}
)

func Cors() gin.HandlerFunc {
	return func(c *gin.Context) {
		if c.Request.Method == "OPTIONS" {
			setPreflight(c)
			c.Status(http.StatusOK)
			c.Abort()
			return
		}

		origin := c.GetHeader("Origin")
		if len(origin) == 0 {
			c.Next()
			return
		}

		c.Header("Access-Control-Allow-Origin", origin)

		if !valid(c) {
			c.Header("Content-Type", "application/json; charset=utf-8")
			c.String(http.StatusForbidden, `{"message":"origin is not allowed"}`)
			c.Abort()
			return
		}
		setCors(c)
		c.Next()
		return
	}
}

func setPreflight(c *gin.Context) {
	c.Header("Access-Control-Allow-Credentials", "true")
	c.Header("Access-Control-Allow-Methods", strings.Join(allowMethods, ","))
	c.Header("Access-Control-Allow-Headers", strings.Join(allowHeaders, ","))
	c.Header("Access-Control-Max-Age", "3600")
}

func setCors(c *gin.Context) {
	c.Header("Access-Control-Allow-Credentials", "true")
	c.Header("Access-Control-Expose-Headers", "Content-Length, Access-Control-Allow-Origin, Access-Control-Allow-Headers, Cache-Control, Content-Language, Content-Type")
}

func valid(c *gin.Context) bool {
	origin := c.GetHeader("Origin")
	for _, domain := range safeDomains {
		if strings.HasPrefix(origin, domain) || c.Request.Method == "OPTIONS" {
			return true
		}
	}
	return false
}
