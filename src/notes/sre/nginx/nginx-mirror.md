---
title: 配合 nginx mirror 实现 bark 多设备通知
date: 2023-03-22
description: nginx 流量复制
tag:
  - Nginx
---

## 起因

- Mac 和 iPhone 都希望使用 bark 通知，不希望在工作时注意力转移到手机上
- bark 是基于设备发送通知，iPhone 和 Mac，发送给多设备需要修改源码

## nginx mirror 是什么

## bark 鉴权

一些接入并不支持鉴权，又希望 bark 只能自己使用 https://github.com/Finb/bark-server/issues/205

## 如何操作

/ZMq6FXzoZRpEoEdakv9RyJ//2pRJxZtWxrnWbMbsDDTjvB/%E6%B5%8B%E8%AF%95?icon=https://waline.js.org/logo.png&sound=telegraph 


/2pRJxZtWxrnWbMbsDDTjvB/%E6%B5%8B%E8%AF%95?icon=https://waline.js.org/logo.png&sound=telegraph 

```
location /2pRJxZtWxrnWbMbsDDTjvB/
{
    mirror /mirror;
    proxy_pass http://127.0.0.1:8180/2pRJxZtWxrnWbMbsDDTjvB/;
    
}

location = /mirror {
    if ($request_uri ~* "/2pRJxZtWxrnWbMbsDDTjvB/(.*)$") {
        set $mirrorReq $1;
    }
    
    internal;
    proxy_pass http://127.0.0.1:8180/ZMq6FXzoZRpEoEdakv9RyJ/$mirrorReq;
}
```
- 
  - https://www.hangge.com/blog/cache/detail_2979.html
  - https://blog.csdn.net/zzhongcy/article/details/129853042
  - http://wenpf.xyz/2020/07/02/%E4%BD%BF%E7%94%A8nginx-mirror%E8%BF%9B%E8%A1%8C%E5%AE%9E%E6%97%B6%E6%B5%81%E9%87%8F%E5%A4%8D%E5%88%B6/
  - https://blog.csdn.net/aiwangtingyun/article/details/120320341
  - https://juejin.cn/post/7005850566333218830
  - https://github.com/Finb/bark-server/issues/100
  - https://github.com/Finb/bark-server/issues/205
  - https://medium.com/@TimvanBaarsen/how-to-connect-to-the-docker-host-from-inside-a-docker-container-112b4c71bc66


