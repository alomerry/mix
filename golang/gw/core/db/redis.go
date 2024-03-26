package db

import (
	"github.com/alomerry/go-tools/static/env"
	"github.com/redis/go-redis/v9"
	"os"
	"strings"
)

var (
	rdb *redis.ClusterClient
)

func init() {
	rdb = redis.NewClusterClient(&redis.ClusterOptions{
		Addrs: GetRedisClusterDSN(),
		// To route commands by latency or randomly, enable one of the following.
		// RouteByLatency: true,
		// RouteRandomly: true,
		Password:            env.GetRedisAK(),
		CredentialsProvider: nil,
	})
}

func GetRedisClusterDSN() []string {
	const REDIS_CLUSTER_DSN = "REDIS_CLUSTER_DSN"
	return strings.Split(os.Getenv(REDIS_CLUSTER_DSN), ",")
}

func Redis() *redis.ClusterClient {
	return rdb
}
