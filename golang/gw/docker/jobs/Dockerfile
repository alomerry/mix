FROM phusion/baseimage:jammy-1.0.2
# 安装 // mysqldump -u root -h alomerry.com -P 13306 -p waline_blog > waline_blog.sql

WORKDIR /app/gw

RUN apt-get update; \
  apt-get install mysql-client; \
  echo 'exec /app/gw/gw' > /etc/service/gw/run;
COPY gw /app/gw/
