package model

import (
	"gorm.io/gorm"
	mysql "gw/core/db"
)

const (
	TableRoles = "role"
)

var CRole = &Role{}

func init() {
	mysql.MySQL().AutoMigrate(&Role{})
}

type Role struct {
	gorm.Model
}
