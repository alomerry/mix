package service

import (
	"context"
	"gw/proto/common"
)

func (b BlogService) BuildBlogIndex(ctx context.Context, request *common.EmptyRequest) (*common.EmptyResponse, error) {
	return &common.EmptyResponse{}, nil
}
