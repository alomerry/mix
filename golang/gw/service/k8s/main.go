package main

import (
	"google.golang.org/grpc/reflection"
	"gw/core/server"
	"gw/proto/k8s"
	"gw/service/k8s/service"
)

func main() {
	s, lis := server.NewServer(8091)
	k8s.RegisterKubernetesServiceServer(s, service.IKubernetesService)
	// 支持 postman 调用
	reflection.Register(s)
	s.Serve(lis)
}
