package tests

import (
	"fmt"
	"sync"
	"testing"
	"unsafe"
)

type Programmer struct {
	name            string
	age             int
	m               sync.Map
	noExistMetricIn chan any
	test            *string
	language        map[string]string
}

func TestSearchBlog(t *testing.T) {
	p := &Programmer{"stefno", 18, sync.Map{}, make(chan any), nil, map[string]string{"a": "123"}}
	fmt.Println(p.language)
	a := "123"
	lang := (*map[string]string)(unsafe.Pointer(uintptr(unsafe.Pointer(p)) + unsafe.Sizeof(int(0)) + unsafe.Sizeof(string("")) + unsafe.Sizeof(sync.Map{}) + unsafe.Sizeof(make(chan any)) + unsafe.Sizeof(&a)))
	(*lang)["23432"] = "12312"

	fmt.Println(p.language)
}
