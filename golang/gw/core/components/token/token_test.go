package token

import (
	"context"
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestTool(t *testing.T) {
	group, err := CTool.GenUserToken(context.Background(), "alomerry")

	t.Logf("%#v", group)
	assert.Nil(t, err)
	assert.NotEmpty(t, group.Token)
	assert.NotEmpty(t, group.RefreshCode)
	assert.Equal(t, "alomerry", group.Username)

	group, err = CTool.RefreshToken(context.Background(), group.RefreshCode)
	t.Logf("%#v", group)
	assert.Nil(t, err)
	assert.NotEmpty(t, group.Token)
	assert.NotEmpty(t, group.RefreshCode)
	assert.Equal(t, "alomerry", group.Username)
}
