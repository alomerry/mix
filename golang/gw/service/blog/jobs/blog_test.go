package jobs

import (
	"context"
	"testing"
)

func TestBlogGenIndex(t *testing.T) {
	ctx := context.Background()
	BuildIndex(ctx, "/home/runner/work/mix/mix/blog")
}
