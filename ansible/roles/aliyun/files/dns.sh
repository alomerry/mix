#!/bin/bash
# thanks for https://blog.csdn.net/GerZhouGengCheng/article/details/106165329
# https://wangdoc.com/bash/function
echo "[$(date "+%G/%m/%d %H:%M:%S")] dns.sh start..."

TTL="600"
DOMAIN_NAME="alomerry.com"
SUB_DOMAIN_NAMES=("waline" "resume" "bark" "blog")

# 设置阿里云的 AccessKeyId/AccessKeySecret,
# 可在 https://ak-console.aliyun.com/ 处获取 ,
# 推荐使用 https://ram.console.aliyun.com/#/user/list 生成的AK/SK, 更安全
ALIYUN_AK=""
ALIYUN_SK=""


# 获取本机 IP
LOCAL_IP=$(curl -s whatismyip.akamai.com)
# DNS 服务器 (推荐 223.5.5.5/223.6.6.6)
DNS_SERVER="223.5.5.5"

[ "$LOCAL_IP" = "" ] && LOCAL_IP="curl -s whatismyip.akamai.com"
[ "$DNS_SERVER" = "" ] && $DNS_SERVER="223.5.5.5"
[ "$TTL" = "" ] && TTL="600"
# URL 加密函数
urlencode() {
    # urlencode <string>
    out=""
    while read -n1 c
    do
        case $c in
            [a-zA-Z0-9._-]) out="$out$c" ;;
            *) out="$out`printf '%%%02X' "'$c"`" ;;
        esac
    done
    echo -n $out
}
# URL 加密命令
enc() {
    echo -n "$1" | urlencode
}
# 发送请求函数
send_request() {
    local args="AccessKeyId=$ALIYUN_AK&Action=$1&Format=json&$2&Version=2015-01-09"
    local hash=$(echo -n "GET&%2F&$(enc "$args")" | openssl dgst -sha1 -hmac "$ALIYUN_SK&" -binary | openssl base64)
    curl -s "http://alidns.aliyuncs.com/?$args&Signature=$(enc "$hash")"
}
# 获取记录值 (RecordID)
get_recordid() {
    grep -Eo '"RecordId":"[0-9]+"' | cut -d':' -f2 | tr -d '"'
}
# 请求记录值 (RecordID)
query_recordid() {
    send_request "DescribeSubDomainRecords" "SignatureMethod=HMAC-SHA1&SignatureNonce=$timestamp&SignatureVersion=1.0&SubDomain=$1.$DOMAIN_NAME&Timestamp=$timestamp"
}
# 更新记录值 (RecordID)
update_record() {
    send_request "UpdateDomainRecord" "RR=$1&RecordId=$2&SignatureMethod=HMAC-SHA1&SignatureNonce=$timestamp&SignatureVersion=1.0&TTL=$TTL&Timestamp=$timestamp&Type=A&Value=$LOCAL_IP"
}
# 添加记录值 (RecordID)
add_record() {
    send_request "AddDomainRecord&DomainName=$DOMAIN_NAME" "RR=$1&SignatureMethod=HMAC-SHA1&SignatureNonce=$timestamp&SignatureVersion=1.0&TTL=$TTL&Timestamp=$timestamp&Type=A&Value=$LOCAL_IP"
}

for SUB_DOMAIN_NAME in "${SUB_DOMAIN_NAMES[@]}"; do
    # 获取当前解析记录 IP
    DOMAIN_IP=`nslookup $SUB_DOMAIN_NAME.$DOMAIN_NAME $DNS_SERVER 2>&1`
    # 判断上一条命令的执行是否成功
    if [ "$?" -eq "0" ]
    then
        # 如果执行成功，分离出结果中的 IP 地址
        DOMAIN_IP=`echo "$DOMAIN_IP" | grep 'Address:' | tail -n1 | awk '{print $NF}'`
        # 进行判断，如果本次获取的新 IP 和旧 IP 相同，则不处理
        if [ "$LOCAL_IP" = "$DOMAIN_IP" ]
        then
            echo "[$(date "+%G/%m/%d %H:%M:%S") $SUB_DOMAIN_NAME] DOMAIN_IP($DOMAIN_IP) is same as LOCAL_IP($LOCAL_IP), next."
            continue
        fi
    fi
    # 如果 IP 发生变动，开始进行修改
    echo "[$(date "+%G/%m/%d %H:%M:%S") $SUB_DOMAIN_NAME] DOMAIN_IP($DOMAIN_IP) is different as LOCAL_IP($LOCAL_IP), updating..."
    # 生成时间戳
    timestamp=`date -u "+%Y-%m-%dT%H%%3A%M%%3A%SZ"`
    RecordID=`query_recordid $SUB_DOMAIN_NAME | get_recordid`
    if [ "$RecordID" = "" ]
    then
        RecordID=`add_record $SUB_DOMAIN_NAME | get_recordid`
        echo "[$(date "+%G/%m/%d %H:%M:%S") $SUB_DOMAIN_NAME] Added RecordID : $RecordID"
    else
        update_record $SUB_DOMAIN_NAME $RecordID
        echo "[$(date "+%G/%m/%d %H:%M:%S") $SUB_DOMAIN_NAME] Updated RecordID : $RecordID"
    fi

    # 输出最终结果
    if [ "$RecordID" = "" ]; then
        # 输出失败结果 (因为没有获取到 RecordID)
        echo "[$(date "+%G/%m/%d %H:%M:%S") $SUB_DOMAIN_NAME] DDNS Update Failed !"
    else
        # 输出成功结果
        echo "[$(date "+%G/%m/%d %H:%M:%S") $SUB_DOMAIN_NAME] DDNS Update Success, New IP is : $LOCAL_IP"
    fi
done
