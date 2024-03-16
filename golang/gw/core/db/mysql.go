package db

import (
	"gw/core/env"
	m "gorm.io/driver/mysql"
	"gorm.io/gorm"
	"time"
)

var (
	mysql *gorm.DB
)

func init() {
	var (
		dsn = env.GetMysqlAdminDSN()
		err error
	)
	mysql, err = gorm.Open(m.Open(dsn), &gorm.Config{})
	if err != nil {
		panic(err)
	}

	mysql = mysql.Set("gorm:table_options", "ENGINE=InnoDB CHARSET=utf8 auto_increment=1")
	sqlDB, err := mysql.DB()
	if err != nil {
		panic(err)
	}
	sqlDB.SetMaxOpenConns(100)
	sqlDB.SetMaxIdleConns(20)
	sqlDB.SetConnMaxLifetime(time.Hour)
}

func GetMySQL() *gorm.DB {
	return mysql
}
