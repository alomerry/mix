package db

import (
	"github.com/alomerry/go-tools/static/env"
	"github.com/redis/go-redis/v9"
)

var (
	rdb *redis.ClusterClient
)

func init() {
	rdb = redis.NewClusterClient(&redis.ClusterOptions{
		Addrs: env.GetRedisClusterDSN(),
		// To route commands by latency or randomly, enable one of the following.
		// RouteByLatency: true,
		// RouteRandomly: true,
		Password:            env.GetRedisAK(),
		CredentialsProvider: nil,
	})
}

func Redis() *redis.ClusterClient {
	return rdb
}
