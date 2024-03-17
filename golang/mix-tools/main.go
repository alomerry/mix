package main

import (
	"context"
	"github.com/alomerry/mix/mix-tools/modules/blog"
)

func main() {
	ctx := context.Background()
	blog.GetClient().BuildIndex(ctx, "/home/runner/work/mix/mix/blog")
}