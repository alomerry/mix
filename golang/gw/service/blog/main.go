package main

import (
	"gw/core/server"
	"gw/proto/blog"
	"gw/service/blog/service"
)

func main() {
	s, lis := server.NewServer(8091)
	blog.RegisterBlogServiceServer(s, &service.BlogService{})
	// 支持 postman 调用
	// reflection.Register(s)
	s.Serve(lis)
}
