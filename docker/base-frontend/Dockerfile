FROM phusion/baseimage:focal-1.1.0 as build

ENV DEBIAN_FRONTEND noninteractive
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

ARG NODE_VERSION=v20.5.1

COPY ./ubuntu-sources.list /etc/apt/sources.list

RUN apt-get update; \
  DEBIAN_FRONTEND="noninteractive" apt-get install --no-install-recommends -y \
  git; \
  apt-get clean; \
  rm -rf /var/lib/apt/lists/* /var/cache/apt/archives/*

ENV NVM_DIR /root/.nvm
RUN curl -s https://cdn.alomerry.com/packages/nvm/install.sh | bash; \
  . ${NVM_DIR}/nvm.sh && \
  NVM_NODEJS_ORG_MIRROR=https://npmmirror.com/mirrors/node/ nvm install ${NODE_VERSION} && \
  nvm alias default ${NODE_VERSION};

ENV NODE_PATH $NVM_DIR/versions/node/${NODE_VERSION}/lib/node_modules
ENV PATH $NVM_DIR/versions/node/${NODE_VERSION}/bin:$PATH

RUN npm config set registry https://registry.npmmirror.com; \
  npm install -g pnpm; \    
  pnpm config set registry https://registry.npmmirror.com 

RUN rm -rf /etc/cron.daily/apt; \
  sed -i 's/#force_color_prompt/force_color_prompt/' /root/.bashrc
