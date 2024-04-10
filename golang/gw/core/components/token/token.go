package token

import (
	"context"
	"crypto/md5"
	"errors"
	"fmt"
	"github.com/alomerry/go-tools/static/env"
	"github.com/alomerry/go-tools/utils/random"
	"gw/core/db"
	"gw/core/log"
	"gw/core/utils/jwt"
	"time"
)

var (
	CTool = &Tool{}
)

const (
	tokenExpireDuration       = time.Hour * 24
	refreshCodeExpireDuration = time.Hour * 72
)

type Tool struct {
}

type Group struct {
	Username    string
	Token       string
	RefreshCode string
}

func (*Tool) GenUserToken(ctx context.Context, username string) (*Group, error) {
	if len(username) == 0 {
		return nil, errors.New("username can't be empty")
	}

	token, err := jwt.GenToken(jwt.Claims{
		Type:     jwt.TokenType,
		Username: username,
		Version:  jwt.Version,
	}, env.GetJwtSecret())
	if err != nil {
		return nil, err
	}

	res, err := db.Redis().Set(ctx, getUserTokenKey(username), token, tokenExpireDuration).Result()
	if err != nil {
		log.Error(ctx, "set token failed", err.Error())
		return nil, err
	}
	if res != "OK" {
		return nil, errors.New("set token into redis failed")
	}

	code := fmt.Sprintf("%x", md5.Sum([]byte(random.String(16))))
	res, err = db.Redis().Set(ctx, getRefreshCodeKey(code), username, refreshCodeExpireDuration).Result()
	if err != nil {
		return nil, err
	}
	if res != "OK" {
		return nil, errors.New("set refresh code into redis failed")
	}

	return &Group{Token: token, RefreshCode: code, Username: username}, nil
}

func (t *Tool) RemoveToken(ctx context.Context, username string) error {
	if len(username) == 0 {
		return errors.New("username can't be empty")
	}

	_, err := db.Redis().Del(ctx, getUserTokenKey(username)).Result()
	if err != nil {
		return err
	}

	return nil
}

func (*Tool) ExtractToken(ctx context.Context, token string) (*jwt.Claims, error) {
	if len(token) == 0 {
		return nil, errors.New("token can't be empty")
	}

	jwtToken, claims, err := jwt.ParseToken(token, env.GetJwtSecret())
	if err != nil {
		return nil, err
	}

	if !jwtToken.Valid {
		return nil, errors.New("invalid token")
	}

	if claims.Version != jwt.Version {
		return nil, errors.New("token is out of version")
	}

	cacheToken, err := db.Redis().Get(ctx, getUserTokenKey(claims.Username)).Result()
	if err != nil {
		return nil, err
	}
	if cacheToken != token {
		return nil, errors.New("illegal token")
	}

	return claims, nil
}

func (t *Tool) RefreshToken(ctx context.Context, code string) (*Group, error) {
	if len(code) == 0 {
		return nil, errors.New("refresh code can't be empty")
	}

	cacheUsername, err := db.Redis().Get(ctx, getRefreshCodeKey(code)).Result()
	if err != nil {
		return nil, err
	}

	cnt, err := db.Redis().Del(ctx, getRefreshCodeKey(code)).Result()
	if err != nil {
		return nil, err
	}
	if cnt == 0 {
		log.Info(ctx, "refresh code have been deleted")
	}

	return t.GenUserToken(ctx, cacheUsername)
}

func getUserTokenKey(username string) string {
	return fmt.Sprintf(`mix-module-admin-token-user:%s`, username)
}

func getRefreshCodeKey(code string) string {
	return fmt.Sprintf(`mix-module-admin-refresh-code:%s`, code)
}
