package combiner

import (
	"gw/core/utils"
)

type CombineOpt struct {
	ignoreEmpty bool
}

type Combiner[T any] struct {
	option *CombineOpt
}

type CombineOptWrapFunc func(*CombineOpt)

func loadOptions(wraps ...CombineOptWrapFunc) *CombineOpt {
	opt := new(CombineOpt)
	for _, f := range wraps {
		f(opt)
	}
	return opt
}

func New[T any](wraps ...CombineOptWrapFunc) *Combiner[T] {
	opt := loadOptions(wraps...)
	return &Combiner[T]{
		option: opt,
	}
}

func WithIgnoreEmpty() CombineOptWrapFunc {
	return func(c *CombineOpt) {
		c.ignoreEmpty = true
	}
}

func (c *Combiner[T]) Combine(arr ...T) []T {
	var res []T
	for i, item := range arr {
		if c.option.ignoreEmpty && utils.IsZero(item) {
			continue
		}
		res = append(res, arr[i])
	}

	return res
}
