package service

import (
	"context"
	"gw/core/codes"
	"gw/core/components/token"
	"gw/proto/admin"
	userCode "gw/service/admin/codes"
	"gw/service/admin/model"
)

func (a AdminService) RefreshLogin(ctx context.Context, req *admin.RefreshLoginRequest) (*admin.LoginResponse, error) {
	group, err := token.CTool.GenUserToken(ctx, req.RefreshToken)
	if err != nil {
		return nil, err
	}

	if !model.CUser.Exists(group.Username) {
		return nil, codes.NewError(userCode.UserNotExist, "TODO")
	}

	var (
		res = &admin.LoginResponse{
			Username:     group.Username,
			Roles:        nil,
			AccessToken:  group.RefreshCode,
			RefreshToken: group.Token,
			ExpireAt:     "",
		}
	)
	return res, nil
}
