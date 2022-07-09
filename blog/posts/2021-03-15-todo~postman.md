---
layout: Post
title: Postman 使用技巧
subtitle:
author: Alomerry Wu
date: 2021-03-15
useHeaderImage: true
catalog: true
headerMask: rgba(40, 57, 101, .5)
headerImage: https://cdn.alomerry.com/blog/img/in-post/header-image?max=59
tags:

- Y2021
- Postman

---

## Postman

### Environments

![Environments](/img/in-post/2021-03-15/postman-globals.png)

### Pre-request Script

![pre-request](/img/in-post/2021-03-15/postman-pre-request.png)

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

### Tests

```js
pm.environment.set('lastResponseStatus', pm.response.code);
```

### 请求 API

![pre-request](/img/in-post/2021-03-15/postman-variable-value.png)
