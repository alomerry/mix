package controller

import (
	"crypto/md5"
	"fmt"
	"github.com/alomerry/go-tools/static/env"
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"gw/core/utils/jwt"
	"gw/modules/admin/model"
	"net/http"
	"time"
)

var (
	admin *AdminController
)

func init() {
	admin = NewAdminController()
	admin.Register()
}

type AdminController struct {
}

func NewAdminController() *AdminController {
	return &AdminController{}
}

func (a *AdminController) Register() {
	registerRouter(Version0, func(v0 *gin.RouterGroup) {
		var (
			a = v0.Group("/admin")
		)

		a.POST("/login", admin.login)
	})
}

type loginReq struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type UserInfo struct {
	Username     string   `json:"username"`
	Roles        []string `json:"roles"`
	AccessToken  string   `json:"accessToken"`
	RefreshToken string   `json:"refreshToken"`
	Expires      string   `json:"expires"`
}

type loginResp struct {
	Success bool     `json:"success"`
	Data    UserInfo `json:"data"`
}

func (a *AdminController) login(c *gin.Context) {
	var (
		req  = &loginReq{}
		resp *loginResp
	)
	err := c.MustBindWith(req, binding.JSON)
	if err != nil {
		panic(err)
	}
	user := model.CUser.FindByNameAndHash(req.Username, fmt.Sprintf("%x", md5.Sum([]byte(req.Password+env.GetDBSalt()))))
	if user == nil {
		c.String(http.StatusForbidden, "账号或密码错误")
		return
	}

	token, err := jwt.GenToken(jwt.Claims{Version: Version0}, env.GetJwtSecret())
	if err != nil {
		panic(err)
	}

	resp = &loginResp{
		Success: true,
		Data: UserInfo{
			Username:     user.Username,
			Roles:        []string{"admin"},
			AccessToken:  token,
			RefreshToken: "",
			Expires:      time.Now().Add(time.Hour * 12).Format("2006/01/02 15:04:05"),
		},
	}

	c.JSON(http.StatusOK, resp)
}
