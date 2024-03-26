package db

import (
	"github.com/alomerry/go-tools/static/env"
	"github.com/redis/go-redis/v9"
)

var (
	rdb *redis.Client
)

func init() {
	rdb = redis.NewClient(&redis.Options{
		Addr:     env.GetRedisDSN(),
		Password: env.GetRedisAK(),
	})
}

func Redis() *redis.Client {
	return rdb
}
