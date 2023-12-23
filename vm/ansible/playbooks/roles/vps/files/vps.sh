#!/bin/bash

modules=("docs.alomerry.com" "blog.alomerry.com" "empty.alomerry.com")

install_depandence() {
  echo "y" | apt-get install tree \
    wget \
    cron \
    lsof
}

install_nginx_depandence() {
  echo "y" | apt-get install socat \
    curl \
    gnupg2  \
    ca-certificates \
    lsb-release \
    ubuntu-keyring
}

install_nginx() {
  if [ -f /usr/sbin/nginx ];then
    echo "nginx has been installed."
  else
    install_nginx_depandence
    curl https://nginx.org/keys/nginx_signing.key | gpg --dearmor | tee /usr/share/keyrings/nginx-archive-keyring.gpg > /dev/null
    gpg --dry-run --quiet --no-keyring --import --import-options import-show /usr/share/keyrings/nginx-archive-keyring.gpg
    echo "deb [signed-by=/usr/share/keyrings/nginx-archive-keyring.gpg] http://nginx.org/packages/ubuntu `lsb_release -cs` nginx" | tee /etc/apt/sources.list.d/nginx.list
    echo -e "Package: *\nPin: origin nginx.org\nPin: release o=nginx\nPin-Priority: 900\n" | tee /etc/apt/preferences.d/99nginx
    apt update
    apt install nginx -y
  fi
}

init_nginx() {
  mkdir /root/apps/nginx/site -p
  mkdir /root/apps/nginx/cert -p
  mkdir /root/apps/nginx/conf -p
  mkdir /root/apps/nginx/logs -p

  touch /root/apps/nginx/cert/privkey.pem
  touch /root/apps/nginx/cert/fullchain.pem

  cp /tmp/nginx/nginx.service /etc/systemd/system/nginx.service
  cp /tmp/nginx/nginx.conf /etc/nginx/nginx.conf
  cp /tmp/nginx/website.conf /root/apps/nginx/conf/website.conf
  chmod 644 /etc/nginx/nginx.conf
  
  for module in "${modules[@]}";
  do
    mkdir /root/apps/nginx/site/${module}/ -p
  done
  systemctl daemon-reload
  sleep 1
  systemctl force-reload nginx
}

install_acme() {
  if [ -f /root/.acme.sh/acme.sh ];then
    /root/.acme.sh/acme.sh --upgrade
    echo "acme has been installed."
  else
    cat /tmp/acme/acme.sh | sh -s -- --install-online && source /root/.bashrc
    /root/.acme.sh/acme.sh --register-account -m alomerry.wu@gmail.com
    /root/.acme.sh/acme.sh --set-default-ca --server letsencrypt

    cp /tmp/acme/account.conf /root/.acme.sh/account.conf
  fi
}

install_ssl() {
  case "$1" in
    renew)
      /root/.acme.sh/acme.sh --renew -d alomerry.com
    ;;
    issue)
      i/root/.acme.sh/acme.sh --issue --dns dns_cf -d alomerry.com -d *.alomerry.com
    ;;
  esac
  
  if [ $? -e 0 ]; then
    /root/.acme.sh/acme.sh --install-cert -d alomerry.com --key-file /root/apps/nginx/cert/privkey.pem --fullchain-file /root/apps/nginx/cert/fullchain.pem
  fi
}

main() {
  install_depandence
  case "$1" in
    nginx)
      install_nginx
      init_nginx
    ;;
    acme)
      install_acme
    ;;
    ssl)
      install_ssl $2
    ;;
    *)
      echo "Done!"
    ;;
  esac
}

main $@
