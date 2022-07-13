FROM phusion/baseimage:focal-1.1.0

ENV DEBIAN_FRONTEND noninteractive
ENV HOME /root
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

# COPY conf/aptSources.list /etc/apt/sources.list

RUN apt-get update
RUN DEBIAN_FRONTEND="noninteractive" apt-get install --no-install-recommends -y \
    ruby-full \
    nodejs \
    build-essential \
    git \
    net-tools \
    wget

RUN apt-get clean
RUN rm -rf /var/lib/apt/lists/* /var/cache/apt/archives/*

RUN curl -s https://cdn.alomerry.com/packages/nvm/install.sh | bash
ENV NVM_DIR /root/.nvm
RUN . ${NVM_DIR}/nvm.sh && nvm install 16.16.0 && nvm alias default 16.16.0

ENV NODE_PATH $NVM_DIR/versions/node/v16.16.0/lib/node_modules
ENV PATH $NVM_DIR/versions/node/v16.16.0/bin:$PATH

RUN npm config set registry https://registry.npm.taobao.org

RUN rm -rf /etc/cron.daily/apt
RUN sed -i 's/#force_color_prompt/force_color_prompt/' /root/.bashrc

RUN cd /root
RUN git clone https://github.com/alomerry/algorithm
RUN cd algorithm/docs
RUN npm install
RUN gem install bundler jekyll
RUN bundle config mirror.https://rubygems.org https://gems.ruby-china.com
RUN bundle install
RUN npm run build