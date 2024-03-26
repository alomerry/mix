package main

import (
	"google.golang.org/grpc/reflection"
	"gw/core/server"
	"gw/proto/admin"
	"gw/service/admin/service"
)

func main() {
	s, lis := server.NewServer(8091)
	admin.RegisterAdminServiceServer(s, service.AdminService{})
	// 支持 postman 调用
	reflection.Register(s)
	s.Serve(lis)
}
