FROM phusion/baseimage:focal-1.1.0 as build

ENV DEBIAN_FRONTEND noninteractive
ENV HOME /root
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

ARG NODE_VERSION=16.16.0

# COPY conf/aptSources.list /etc/apt/sources.list

RUN apt-get update; \
  DEBIAN_FRONTEND="noninteractive" apt-get install --no-install-recommends -y \
  ruby-dev \
  git \
  build-essential \
  ; \
  apt-get clean; \
  rm -rf /var/lib/apt/lists/* /var/cache/apt/archives/*

ENV NVM_DIR /root/.nvm
RUN curl -s https://cdn.alomerry.com/packages/nvm/install.sh | bash; \
  . ${NVM_DIR}/nvm.sh && nvm install ${NODE_VERSION} && nvm alias default ${NODE_VERSION} && nvm use default ${NODE_VERSION}

ENV NODE_PATH $NVM_DIR/versions/node/v${NODE_VERSION}/lib/node_modules
ENV PATH $NVM_DIR/versions/node/v${NODE_VERSION}/bin:$PATH

RUN npm config set registry https://registry.npm.taobao.org; \
  npm install -g yarn; \    
  yarn config set registry https://registry.npmmirror.com

RUN gem sources --remove https://rubygems.org/; \
  gem sources -a https://gems.ruby-china.com; \
  gem install bundler jekyll; \
  bundle config mirror.https://rubygems.org https://gems.ruby-china.com; \
  gem clean

WORKDIR /var/jenkins_home/workspace

RUN rm -rf /etc/cron.daily/apt; \
  sed -i 's/#force_color_prompt/force_color_prompt/' /root/.bashrc

# docker build -t alomerry/algorithm .
# docker run --name test --rm -ti -v /etc/timezone:/etc/timezone:ro -v /etc/localtime:/etc/localtime:ro alpine /bin/sh