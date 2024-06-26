#!/usr/bin/env bash

GEN_GO_COMMAND="--go_out=. --go_opt=paths=source_relative"
GEN_GRPC_COMMAND="--go-grpc_out=. --go-grpc_opt=require_unimplemented_servers=false,paths=source_relative"
GEN_GATEWAY_COMMAND="--grpc-gateway_out=. --grpc-gateway_opt=paths=source_relative"

# TODO gen swagger

WORK_DIR=${WORK_DIR:-$(
  cd "${0%/*}"
  pwd
)}

source "${WORK_DIR}"/scripts/print.sh

gen_proto_files() {
  shopt -s globstar

  local proto_files="${WORK_DIR}"/**/*.proto
  local proto_folders=()
  for file_name in ${proto_files}; do
    proto_folders+=("${file_name%/*\.proto}")
  done

  folders=("$(echo "${proto_folders[@]}" | tr ' ' '\n' | sort -u | tr '\n' ' ')")
  echo "${folders[@]}"
  shopt -u globstar
}

generate_protobuf_stub() {
  folders=($(gen_proto_files))
  for folder in "${folders[@]}"; do
    GEN_GO_COMMAND="--go_out=${folder} --go_opt=paths=source_relative"
    GEN_GRPC_COMMAND="--go-grpc_out=${folder} --go-grpc_opt=require_unimplemented_servers=false,paths=source_relative"
    GEN_GATEWAY_COMMAND="--grpc-gateway_out=${folder} --grpc-gateway_opt=paths=source_relative"

    local gateway_command="${GEN_GATEWAY_COMMAND},grpc_api_configuration=${folder}/consumer.yml"

    if [ ${folder/common/-} == ${folder} ]; then
      # 生成模块 service proto
      gen_service_cmd="protoc ${GEN_GO_COMMAND} ${GEN_GRPC_COMMAND} ${gateway_command} ${folder}/service.proto -I${folder} -I."
      $gen_service_cmd

      proto_files=$(find ${folder} -name "*.proto" | grep -v "service.proto")
      gen_proto_cmd="protoc ${GEN_GO_COMMAND} ${GEN_GRPC_COMMAND} $proto_files -I${folder} -I."
      $gen_proto_cmd
    else
      # 生成 common proto
      gen_proto_cmd="protoc ${GEN_GO_COMMAND} ${GEN_GRPC_COMMAND} ${folder}/*.proto -I${folder} -I."
      $gen_proto_cmd
    fi
  done
}

generate_gateway_loader() {
  cd proto/scripts
  go build -ldflags="-s -w" generate_gateway_loader.go
}

clean() {
  title "bash version: $BASH_VERSION"
  set +e
  shopt -s globstar

  rm -f "${WORK_DIR}"/**/*.pb.go
  rm -f "${WORK_DIR}"/**/*.gw.go
  rm -f "${WORK_DIR}"/**/*.swagger.json

  shopt -u globstar
  set -e
}

clean
generate_protobuf_stub
