package db

import (
	"github.com/redis/go-redis/v9"
)

var (
	rdb *redis.Client
)

func init() {
	rdb = redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "WjC120211",
	})
}

func Redis() *redis.Client {
	return rdb
}
