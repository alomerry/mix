---
title: Postman 使用技巧
date: 2021-03-15
tag:
  - Postman
---

## Environments

![Environments](https://cdn.alomerry.com/blog/assets/img/posts/postman-globals.png)

## Pre-request Script[^postman-javaScript-reference]

![pre-request](https://cdn.alomerry.com/blog/assets/img/posts/postman-pre-request.png)

```js
var lastResponseStatus = pm.environment.get("lastResponseStatus");

if (lastResponseStatus != 200) {
  const accountId = pm.environment.get("accountId");
  var data = {
    "account": "",
    "password": "",
    "accountId": accountId
  }
  const openapi_business_domain = pm.environment.get("openapi-business");

  const loginRequest = {
    url: 'https://' + openapi_business_domain + '/v2/login',
    method: 'POST',
    header: 'Content-Type:application/json',
    body: {
      mode: 'raw',
      raw: JSON.stringify(data)
    }
  };
  pm.sendRequest(loginRequest, function (err, res) {
    if (err) {
      console.log(err);
    } else {
      const jsonData = res.json();
      pm.environment.set('X-Access-Token', jsonData.accessToken);
    }
  });
}
```

## Tests

```js
pm.environment.set('lastResponseStatus', pm.response.code);
```

## 请求 API

![pre-request](https://cdn.alomerry.com/blog/assets/img/posts/postman-variable-value.png)

## Case 

### 使用 Environment、Pre-request Script 注入请求参数

测试 API 时需要 mock 一个随机字符串

pre-request script 代码[^js-random-string]：

```javascript
let randomId = (new Date()).toISOString()+Math.random().toString(36).slice(-8);
pm.environment.set('randomId', randomId);
```

## Reference

[^js-random-string]: [原生 JAVAScript 生成简单随机字符串](https://juejin.cn/post/6844903665522704398)

[^postman-javaScript-reference]: [Postman JavaScript reference](https://learning.postman.com/docs/writing-scripts/script-references/postman-sandbox-api-reference/)