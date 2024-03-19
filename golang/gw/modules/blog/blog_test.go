package blog

import (
	"context"
	"testing"
)

func TestBlogGenIndex(t *testing.T) {
	ctx := context.Background()
	GetClient().BuildIndex(ctx, "/home/runner/work/mix/mix/blog")
}
