package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	flag "github.com/spf13/pflag"
	"github.com/spf13/viper"
	"gopkg.in/tylerb/graceful.v1"
	"gw/controller"
	"gw/middleware"
	"time"
)

var (
	port = flag.String("port", "4790", "the listen port, default 4790")
)

func main() {
	var (
		r = gin.Default()
	)

	r.Use(middleware.Cors())

	controller.InitRouter(r)

	_ = viper.BindPFlag("port", flag.Lookup("port"))
	flag.Parse()

	graceful.Run(fmt.Sprintf(":%s", *port), 5*time.Second, r)
}
