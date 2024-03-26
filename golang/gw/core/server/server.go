package server

import (
	"fmt"
	"google.golang.org/grpc"
	"net"
	"os"
	"os/signal"
	"syscall"
)

func NewServer(servicePort int) (*grpc.Server, net.Listener) {
	l, err := net.Listen("tcp", fmt.Sprintf("0.0.0.0:%d", servicePort))
	if err != nil {
		panic(err)
	}

	s := grpc.NewServer()
	return s, l
}

func gracefulShutdownWarp(s *grpc.Server) {
	shutdownCh := make(chan os.Signal, 1)
	signal.Notify(shutdownCh, syscall.SIGTERM)
	go func() {
		<-shutdownCh
		s.GracefulStop()
	}()
}
