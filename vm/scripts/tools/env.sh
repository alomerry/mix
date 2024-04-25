# export http_proxy=127.0.0.1:7890 https_proxy=127.0.0.1:7890
# unset http_proxy https_proxy

PROXY=127.0.0.1:7890

# https://raw.githubusercontent.com/alomerry/mix/master/vm/scripts
export GIT_RAW_URL=https://raw.githubusercontent.com; \
  export BRANCH=master; \
  export MIX_REPOSITORY=alomerry/mix; \
  export MIX_VM_VPS_STATIC=vm/scripts/app; \
  export SCRIPTS_PATH=${GIT_RAW_URL}/${MIX_REPOSITORY}/${BRANCH}/${MIX_VM_VPS_STATIC}; \
  export NGINX_PATH=${GIT_RAW_URL}/${MIX_REPOSITORY}/${BRANCH}/${MIX_VM_VPS_STATIC}/nginx; \
  export V2RAY_PATH=${GIT_RAW_URL}/${MIX_REPOSITORY}/${BRANCH}/${MIX_VM_VPS_STATIC}/v2ray; \
  export ACME_PATH=${GIT_RAW_URL}/${MIX_REPOSITORY}/${BRANCH}/${MIX_VM_VPS_STATIC}/acme; \
  export FRP_PATH=${GIT_RAW_URL}/${MIX_REPOSITORY}/${BRANCH}/${MIX_VM_VPS_STATIC}/frp; \
  export SECRET_PATH=${GIT_RAW_URL}/alomerry/secrets/master; \
  export JAVA_VERSION=${JAVA_VERSION:-"8"};