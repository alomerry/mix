package model

import (
	"gorm.io/gorm"
	mysql "gw/core/db"
)

var CUser = &User{}

func init() {
	mysql.GetMySQL().AutoMigrate(&User{})
}

type User struct {
	gorm.Model
	Username string
	//Hash     string
}

func (*User) FindByNameAndHash(name, hash string) *User {
	var user = &User{}
	if err := mysql.GetMySQL().Where(" username = ? and hash = ?", name, hash).First(user).Error; err != nil {
		return nil
	}
	return user
}
