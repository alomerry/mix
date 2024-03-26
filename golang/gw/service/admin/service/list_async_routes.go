package service

import (
	"context"
	"gw/proto/admin"
)

func (a AdminService) ListAsyncRoutes(ctx context.Context, req *admin.ListAsyncRoutesRequest) (*admin.ListAsyncRoutesResponse, error) {
	return &admin.ListAsyncRoutesResponse{Data: []string{}}, nil
}
