package db

import (
	"github.com/alomerry/go-tools/static/env"
	sql "github.com/alomerry/go-tools/utils/db/mysql"
)

func init() {
	sql.Instance(func() string {
		return env.GetWithLocalMysqlAdminDSN()
	})
}

