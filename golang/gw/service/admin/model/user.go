package model

import (
	"gorm.io/gorm"
	"github.com/alomerry/go-tools/utils/db/mysql"
)

const (
	TableUsers = "users"
)

var CUser = &User{}

func init() {
	mysql.Session().AutoMigrate(&User{})
}

type User struct {
	gorm.Model
	Username string // TODO unique
	Hash     string
}

func (*User) FindByNameAndHash(name, hash string) *User {
	var (
		user = &User{}
	)
	if err := mysql.Session().Table(TableUsers).Where(" username = ? and hash = ?", name, hash).First(user).Error; err != nil {
		return nil
	}
	return user
}

func (*User) Exists(name string) bool {
	var (
		cnt int64
	)
	if err := mysql.Session().Table(TableUsers).Where(" username = ? ", name).Count(&cnt).Error; err != nil {
		// TODO error
		return false
	}
	return cnt > 0
}
