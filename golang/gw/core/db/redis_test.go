package db

import (
	"context"
	"github.com/stretchr/testify/assert"
	"strings"
	"testing"
)

func TestRedis(t *testing.T) {
	var (
		ctx = context.Background()
	)

	assert.True(t, strings.Index(rdb.ClusterInfo(ctx).String(), "cluster_known_nodes:6") > 0)
	assert.True(t, strings.Index(rdb.ClusterInfo(ctx).String(), "cluster_size:3") > 0)
}
