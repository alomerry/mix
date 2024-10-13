创建并编辑这个文件sudo nano /etc/systemd/system/docker.service.d/proxy.conf

添加下面内容，和给 bash 添加 clash 代理是类似的。

[Service]
Environment="HTTPS_PROXY=192.168.31.2:7890"
Environment="HTTP_PROXY=192.168.31.2:7890"
然后重启 docker

sudo systemctl daemon-reload
sudo systemctl restart docker
