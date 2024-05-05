package model

import (
	"github.com/alomerry/go-tools/utils/db/mysql"
	"gorm.io/gorm"
)

const (
	TableRoles = "role"
)

var CRole = &Role{}

func init() {
	mysql.Session().AutoMigrate(&Role{})
}

type Role struct {
	gorm.Model
}
