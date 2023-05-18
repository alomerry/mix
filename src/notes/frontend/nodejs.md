---
date: 2020-07-11
isOriginal: true
tag: 
  - nodejs
---

# Node.js Note

## 常用

### nvm 安装

**Linux 安装**

- curl -s https://cdn.alomerry.com/packages/nvm/install.sh | zsh
- nvm ls-remote
- nvm install v19.2.0
- nvm use default v19.2.0

**Mac M1 安装**

https://juejin.cn/post/7000245004526419981

显示安装的 node.js 的版本

```shell
node -p "process.arch"
arm64
```

查看全局安装的包

npm list -g --depth 0

卸载全局安装的包

npm uninstall yarn -g