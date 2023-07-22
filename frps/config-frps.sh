#!/bin/bash
content=$(wget -qO- -t1 -T2 "https://api.github.com/repos/fatedier/frp/releases/latest" | grep "tag_name" | head -n 1 | awk -F ":" '{print $2}' | sed 's/\"//g;s/,//g;s/ //g')
echo "Latest frp version is $content"
fileName="frp_$(echo $content | cut -d "v" -f 2)_linux_amd64.tar.gz"
dirName="frp_$(echo $content | cut -d "v" -f 2)_linux_amd64"
downloadUrl="https://github.com/fatedier/frp/releases/download/$content/$fileName"
echo -e "input abstract path for new version frp"
read frpPath #/home/ubuntu/apps /home/alomerry/workspace/vps-home/frps
echo "start download $content from $downloadUrl"
wget -P "$frpPath/" "$downloadUrl"
tar -xf "$frpPath/$fileName"
rm "$frpPath/$fileName"
rm "$frpPath/$dirName/frpc.ini"
rm "$frpPath/$dirName/frpc"
rm "$frpPath/$dirName/frpc_full.ini"
rm "$frpPath/$dirName/frps_full.ini"
cp "./frps.ini" "$frpPath/$dirName/"
# sudo service frps status
# sudo lsof -i:7000
# systemctl daemon-reload