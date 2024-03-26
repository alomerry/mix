package codes

import (
	"k8s.io/kube-openapi/pkg/validation/errors"
)

type Code uint32

const (
	SystemError Code = 100000 + iota
	InternalServerError
	UnknownError
	InvalidParams
)

func NewError(code Code, msg string) error {
	return errors.New(int32(code), msg)
}
