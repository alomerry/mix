package jobs

import (
	"context"
	"fmt"
	"github.com/alomerry/go-tools/components/oss/s3"
	"github.com/alomerry/go-tools/static/cons"
	"github.com/alomerry/go-tools/static/env"
	"github.com/alomerry/go-tools/utils/db"
)

const (
	backup               = "backup"
	backupDatabasePrefix = backup + "/database"
)

func backupMySQL() {
	var (
		needBackupDB = []cons.Database{cons.WalineBlog, cons.Umami}
		tool         = db.NewDumpTool(db.MySQLDumpCmdParam(env.GetMysqlAdminDSN()))
		oss          = s3.NewDefaultCloudflareR2()
		ctx          = context.TODO()
	)

	backups, err := tool.DumpDbs(needBackupDB...)
	if err != nil {
		panic(err)
	}

	for i := range backups {
		oss.UploadFromLocal(ctx, cons.OssBucketCdn, backups[i], fmt.Sprintf("%v/%v", backupDatabasePrefix, ""))
	}
}
