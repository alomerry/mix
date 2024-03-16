package jwt

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

const (
	testTokenSecret = "test"
)

var (
	testClaims = Claims{Version: "v0"}
)

func TestToken(t *testing.T) {
	var (
		token string
	)
	t.Run("test create token", func(t *testing.T) {
		var err error
		token, err = GenToken(testClaims, testTokenSecret)
		assert.Nil(t, err)
	})

	t.Run("test parse token", func(t *testing.T) {
		jwt, claims, err := ParseToken(token, testTokenSecret)
		assert.Nil(t, err)
		assert.Equal(t, testClaims.Version, claims.Version)
		assert.True(t, jwt.Valid)
	})
}
