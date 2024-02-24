---
date: 2021-03-04T16:00:00.000+00:00
title: api 工具手册
todoNext:
  - 文字过少
duration: 1min
wordCount: 202
update: 2024-02-24T19:17:18.318Z
---

[[toc]]

## postman

### Environments

![Environments](https://cdn.alomerry.com/blog/assets/img/posts/postman-globals.png)

### Pre-request Script[^postman-javaScript-reference]

![pre-request](https://cdn.alomerry.com/blog/assets/img/posts/postman-pre-request.png)

```js
const lastResponseStatus = pm.environment.get('lastResponseStatus')

if (lastResponseStatus != 200) {
  const accountId = pm.environment.get('accountId')
  const data = {
    account: '',
    password: '',
    accountId
  }
  const openapi_business_domain = pm.environment.get('openapi-business')

  const loginRequest = {
    url: `https://${openapi_business_domain}/v2/login`,
    method: 'POST',
    header: 'Content-Type:application/json',
    body: {
      mode: 'raw',
      raw: JSON.stringify(data)
    }
  }
  pm.sendRequest(loginRequest, (err, res) => {
    if (err) {
      console.log(err)
    }
    else {
      const jsonData = res.json()
      pm.environment.set('X-Access-Token', jsonData.accessToken)
    }
  })
}
```

### Tests

```js
pm.environment.set('lastResponseStatus', pm.response.code)
```

### 请求 API

![pre-request](https://cdn.alomerry.com/blog/assets/img/posts/postman-variable-value.png)

### Case

#### 使用 Environment、Pre-request Script 注入请求参数

测试 API 时需要 mock 一个随机字符串

pre-request script 代码[^js-random-string]：

```javascript
let randomId = (new Date()).toISOString() + Math.random().toString(36).slice(-8);
pm.environment.set('randomId', randomId);
```

### Reference

[^js-random-string]: [原生 JAVAScript 生成简单随机字符串](https://juejin.cn/post/6844903665522704398)
[^postman-javaScript-reference]: [Postman JavaScript reference](https://learning.postman.com/docs/writing-scripts/script-references/postman-sandbox-api-reference/)
