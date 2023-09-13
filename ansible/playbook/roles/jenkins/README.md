```shell
curl -sSL "http://user:passwd@host:port/pluginManager/api/xml?depth=1&xpath=/*/*/shortName|/*/*/version&wrapper=plugins" | perl -pe 's/.*?<shortName>([\w-]+).*?<version>([^<]+)()(<\/\w+>)+/\1 \2\n/g'|sed 's/ /:/"
```

```
docker compose -f jenkins.yml build registry.cn-hangzhou.aliyuncs.com/alomerry/jenkins:latest
```

```
Jenkins.instance.pluginManager.plugins.each{
  plugin ->
    println ("${plugin.getShortName()}:${plugin.getVersion()}")
}
```

## ENV

- vps-admin
  - password
  - username
- tencent-vps-admin
  - password
  - username
- cdn-domain
- bark-notification-device-alomerry
- bark-notification-device-tobery1
- wehook-trigger-token
- docker-login
  - user
  - password
- docker-registry
- k8s-master
  - username
  - password
