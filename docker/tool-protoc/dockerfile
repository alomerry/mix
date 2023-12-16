FROM registry.cn-hangzhou.aliyuncs.com/alomerry/base-golang:1.21

RUN apt-get update; \
  DEBIAN_FRONTEND="noninteractive" apt-get install --no-install-recommends -y \
  protobuf-compiler; \
  apt-get clean;

RUN go install google.golang.org/protobuf/cmd/protoc-gen-go@v1.28; \
  go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@v1.2; \
  go install github.com/grpc-ecosystem/grpc-gateway/v2/protoc-gen-grpc-gateway@v2.18; \
  go install github.com/grpc-ecosystem/grpc-gateway/v2/protoc-gen-openapiv2@v2.18; \