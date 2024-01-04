#!/bin/bash

modules=("docs.alomerry.com" "blog.alomerry.com" "empty.alomerry.com")
FRP_VERSION=${FRP_VERSION:-"0.51.3"}

install_depandence() {
  echo "y" | apt-get install tree \
    aptitude \
    ca-certificates \
    curl \
    gnupg \
    wget \
    cron \
    lsof
}

install_nginx_depandence() {
  echo "y" | apt-get install socat \
    curl \
    gnupg2 \
    ca-certificates \
    lsb-release \
    ubuntu-keyring
}

install_nginx() {
  if [ -f /usr/sbin/nginx ]; then
    echo "nginx has been installed."
  else
    install_nginx_depandence
    curl https://nginx.org/keys/nginx_signing.key | gpg --dearmor | tee /usr/share/keyrings/nginx-archive-keyring.gpg >/dev/null
    gpg --dry-run --quiet --no-keyring --import --import-options import-show /usr/share/keyrings/nginx-archive-keyring.gpg
    echo "deb [signed-by=/usr/share/keyrings/nginx-archive-keyring.gpg] http://nginx.org/packages/ubuntu $(lsb_release -cs) nginx" | tee /etc/apt/sources.list.d/nginx.list
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

  wget -P /etc/systemd/system/ https://raw.githubusercontent.com/alomerry/mix/master/vm/ansible/playbooks/roles/vps/files/nginx/nginx.service
  wget -P /etc/nginx/ https://raw.githubusercontent.com/alomerry/mix/master/vm/ansible/playbooks/roles/vps/files/nginx/nginx.conf
  wget -P /root/apps/nginx/conf/ https://raw.githubusercontent.com/alomerry/mix/master/vm/ansible/playbooks/roles/vps/files/nginx/website.conf
  chmod 644 /etc/nginx/nginx.conf

  for module in "${modules[@]}"; do
    mkdir /root/apps/nginx/site/${module}/ -p
  done
  systemctl daemon-reload
  sleep 1
  systemctl force-reload nginx
}

install_acme() {
  if [ -f /root/.acme.sh/acme.sh ]; then
    /root/.acme.sh/acme.sh --upgrade
    echo "acme has been installed."
  else
    wget -P /tmp/ https://raw.githubusercontent.com/alomerry/mix/master/vm/ansible/playbooks/roles/vps/files/acme/acme.sh
    cat /tmp/acme.sh | sh -s -- --install-online && source /root/.bashrc
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
    /root/.acme.sh/acme.sh --issue --dns dns_cf -d alomerry.com -d *.alomerry.com
    ;;
  esac

  if [ $? -e 0 ]; then
    /root/.acme.sh/acme.sh --install-cert -d alomerry.com --key-file /root/apps/nginx/cert/privkey.pem --fullchain-file /root/apps/nginx/cert/fullchain.pem
  fi
}

install_frps() {
  mkdir /root/apps/frps -p

  wget -P /tmp/ https://github.com/fatedier/frp/releases/download/v${FRP_VERSION}/frp_${FRP_VERSION}_linux_amd64.tar.gz
  tar -xf /tmp/frp_${FRP_VERSION}_linux_amd64.tar.gz --strip-components 1 -C /root/apps/frps/

  # touch /root/apps/frps/${FRP_VERSION}.version

  wget -P /etc/systemd/system/ https://raw.githubusercontent.com/alomerry/mix/master/vm/ansible/playbooks/roles/frps/files/frps.service

  systemctl enable frps.service
  systemctl stop frps.service
  systemctl daemon-reload
  systemctl start frps.service

  # clean_frps
  rm -rf /root/apps/frps/frps.tar.gz
  rm -rf /root/apps/frps/frpc
  rm -rf /root/apps/frps/frpc_full.ini
  rm -rf /root/apps/frps/frps_full.ini
  rm -rf /root/apps/frps/frpc.ini
}

main() {

  journalctl --vacuum-time=1d && journalctl --vacuum-size=30M

  install_depandence
  case "$1" in
  frps)
    install_frps
    ;;
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
