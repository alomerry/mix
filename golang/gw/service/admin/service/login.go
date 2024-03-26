package service

import (
	"context"
	"crypto/md5"
	"fmt"
	"github.com/alomerry/go-tools/modules/copier"
	"github.com/alomerry/go-tools/static/env"
	"gw/core/codes"
	"gw/core/components/token"
	"gw/proto/admin"
	userCode "gw/service/admin/codes"
	"gw/service/admin/model"
)

func (a AdminService) Login(ctx context.Context, req *admin.LoginRequest) (*admin.LoginResponse, error) {
	if !model.CUser.Exists(req.Username) {
		return nil, codes.NewError(userCode.UserNotExist, "TODO")
	}

	user := model.CUser.FindByNameAndHash(req.Username, fmt.Sprintf("%x", md5.Sum([]byte(req.Password+env.GetDBSalt()))))
	if user == nil {
		return nil, codes.NewError(userCode.UserPasswdNotCorrect, "TODO")
	}

	group, err := token.CTool.GenUserToken(ctx, user.Username)
	if err != nil {
		return nil, err
	}
	var (
		res = &admin.LoginResponse{
			Username:     user.Username,
			Roles:        nil,
			AccessToken:  group.RefreshCode,
			RefreshToken: group.Token,
			ExpireAt:     "",
		}
	)
	_ = copier.Instance(nil).From(user).CopyTo(res)
	return res, nil
}
