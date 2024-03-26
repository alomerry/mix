#!/usr/bin/env bash

HOME_PATH=$(
  cd $(dirname ${0})
  pwd
)

SERVICE_PATH=${HOME_PATH}/service
OPENAPI_PATH=${HOME_PATH}/openapi/consumer
PROTO_PATH=${HOME_PATH}/proto

main() {
  case "$1" in
    gateway)
      rm -rf "${PROTO_PATH}"/scripts/genGatewayLoader/genGatewayLoader "${PROTO_PATH}"/genGatewayLoader.go
      go build -o "${PROTO_PATH}"/scripts/genGatewayLoader/genGatewayLoader "${PROTO_PATH}"/scripts/genGatewayLoader/generate_gateway_loader.go
      "${PROTO_PATH}"/scripts/genGatewayLoader/genGatewayLoader
      ;;
    proto)
      "${PROTO_PATH}"/gen-stub.sh "${@:2}"
      ;;
    service)
      "${SERVICE_PATH}"/scripts/build "${@:2}"
      ;;
    *)
    help
      ;;
  esac
}

help() {
  echo "$0 option"
  echo -e "\nOptions:"
  echo "    service proto gateway business consumer"
  exit 1
}

main "$@"
