package db

import (
	"github.com/alomerry/go-tools/static/env"
	m "gorm.io/driver/mysql"
	"gorm.io/gorm"
	"time"
)

var (
	mysql *gorm.DB
	debug = true
)

func init() {
	var (
		dsn = env.GetMysqlAdminDSN()
		err error
	)
	mysql, err = gorm.Open(m.Open(dsn), &gorm.Config{
		// PrepareStmt: false, // https://gorm.io/zh_CN/docs/performance.html#缓存预编译语句
	})
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

func MySQL() *gorm.DB {
	if debug {
		return mysql.Debug().Session(&gorm.Session{})
	}
	return mysql.Session(&gorm.Session{})
}
