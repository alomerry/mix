package jwt

import (
	"context"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"gw/core/log"
	"time"
)

const (
	Issuer = "gw"

	Version = "v0"

	TokenType       Type = "TokenType"
	RefreshCodeType Type = "RefreshCodeType"
)

type Type string

type Claims struct {
	Version  string `json:"version"`
	Username string `json:"username"`
	Type     Type   `json:"type"`
}

type customClaims struct {
	Claims
	jwt.RegisteredClaims
}

func GenToken(custom Claims, secret string) (string, error) {
	claims := customClaims{
		Claims: custom,
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    Issuer,
			Subject:   "",
			Audience:  nil,
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			NotBefore: jwt.NewNumericDate(time.Now()),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			ID:        uuid.New().String(),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	log.Error(context.TODO(), token.Raw)
	str, err := token.SignedString([]byte(secret))
	if err != nil {
		return "", err
	}
	return str, nil
}

func ParseToken(str, secret string) (*jwt.Token, *Claims, error) {
	token, err := jwt.ParseWithClaims(str, &customClaims{}, func(token *jwt.Token) (any, error) {
		return []byte(secret), nil
	})
	if err != nil {
		return nil, nil, err
	}
	claims, success := token.Claims.(*customClaims)
	if !success {
		return token, nil, nil
	}
	return token, &(claims.Claims), nil
}
