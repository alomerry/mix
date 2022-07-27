---
layout: Post
title: Docker Note
subtitle:
author: Alomerry Wu
date: 2022-04-26
update: 2022-07-22
useHeaderImage: true
catalog: true
headerMask: rgba(40, 57, 101, .5)
headerImage: https://cdn.alomerry.com/blog/img/in-post/header-image?max=59
tags:

- Y2022
- Docker
- U2022

---

## TODO

https://vuepress.mirror.docker-practice.com/

practice https://github.com/yeasy/docker_practice

https://blog.csdn.net/mar_ljh/article/details/109011822

build https://yeasy.gitbook.io/docker_practice/image/build

https://yeasy.gitbook.io/docker_practice/

docker -t build alomerry/xxx  .
docker login
docker push


https://yeasy.gitbook.io/docker_practice/image/multistage-builds/laravel

## Docker

### Install [^install-docker]

- `sudo apt-get remove docker docker-engine docker.io containerd runc`
- `sudo apt-get update`
- `sudo apt-get install ca-certificates curl gnupg lsb-release`
- `curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg`
- `echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null`
- `sudo apt-get update`
- `sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin`
- `sudo docker run hello-world`

- [设置阿里云镜像加速服务]((https://help.aliyun.com/document_detail/60750.html))

### 常用命令

docker ps
docker run
docker images
docker rmi
docker stop
docker rm
docker history
docker inspect
docker tag
docker build
docker pull
docker push

## Docker Compose

## Dockerfile

### Images and layers[^images-and-layers]

先来看一段官方文档上的描述：

:::tip
A Docker image is built up from a series of layers. Each layer represents an instruction in the image’s Dockerfile. Each layer except the very last one is read-only. Consider the following Dockerfile:

```dockerfile
# syntax=docker/dockerfile:1
FROM ubuntu:18.04
LABEL org.opencontainers.image.authors="org@example.com"
COPY . /app
RUN make /app
RUN rm -r $HOME/.cache
CMD python /app/app.py
```

This Dockerfile contains four commands. Commands that modify the filesystem create a layer. TheFROM statement starts out by creating a layer from the ubuntu:18.04 image. The LABEL command only modifies the image’s metadata, and does not produce a new layer. The COPY command adds some files from your Docker client’s current directory. The first RUN command builds your application using the make command, and writes the result to a new layer. The second RUN command removes a cache directory, and writes the result to a new layer. Finally, the CMD instruction specifies what command to run within the container, which only modifies the image’s metadata, which does not produce an image layer.

Each layer is only a set of differences from the layer before it. Note that both adding, and removing files will result in a new layer. In the example above, the $HOME/.cache directory is removed, but will still be available in the previous layer and add up to the image’s total size. Refer to the [Best practices for writing Dockerfiles](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)[^best-practices-for-writing-Dockerfiles] and [use multi-stage builds](https://docs.docker.com/develop/develop-images/multistage-build/)[^use-multi-stage-builds] sections to learn how to optimize your Dockerfiles for efficient images.

The layers are stacked on top of each other. When you create a new container, you add a new writable layer on top of the underlying layers. This layer is often called the “container layer”. All changes made to the running container, such as writing new files, modifying existing files, and deleting files, are written to this thin writable container layer. The diagram below shows a container based on an ubuntu:15.04 image.
:::

在构建 docker 镜像时，应该尽量想办法获得体积更小的镜像。而 docker 镜像是由一系列的层组成，dockerfile 中的每层代表了一个操作，除了最后一层其它层都是只读的。对镜像的配置，例如设置 ENV、LABEL、CMD 等，如果命令没有使镜像的数据产生变动，是不创建新的层的，新生成的层是对上一层的变更，有点类似 git 中的 diff。当我们创建一个容器时，实际上是在镜像上层添加了新的可写层（容器层）。

- https://www.infoq.cn/article/3-simple-tricks-for-smaller-docker-images
- https://itnext.io/3-simple-tricks-for-smaller-docker-images-f0d2bda17d1e

因此对于下面的写法：

```dockerfile
From ubuntu
RUN apt-get update
RUN apt-get install vim
```

更好的写法应该是：

```dockerfile
From ubuntu
RUN apt-get update && apt-get install vim
```

减小临时层来缩小构建出的镜像大小。

![container-layers](/img/in-post/2022-04-27/container-layers.jpg)

### Container and layers [^container-and-layers]

当有多个容器依赖同一个镜像时，底部层实际上使用的都是同一个只读的镜像层，各个容器拥有自己的可写容器层。

![sharing-layers](/img/in-post/2022-04-27/sharing-layers.jpg)

- `docker inspect [image name]` 可以查看镜像底层信息
- `docker history [image name]` 可以查看镜像构建历史

:::details

`docker inspect registry.cn-hangzhou.aliyuncs.com/alomerry/algorithm`

```json
[
    {
        "Id": "sha256:423a301d36033e30b8f9ce507e5ca4268c18d3d448ca85a0f6806a4232e6951c",
        "RepoTags": [
            "registry.cn-hangzhou.aliyuncs.com/alomerry/algorithm:latest"
        ],
        "RepoDigests": [
            "registry.cn-hangzhou.aliyuncs.com/alomerry/algorithm@sha256:189d4b21388f7dd11db498ecc01f9c1c847b8224f6bd9187aea202cc146db051"
        ],
        "Parent": "",
        "Comment": "",
        "Created": "2022-07-13T04:33:26.889614907Z",
        "Container": "bcb11efc411e16d0bc60f3fdf14fd45b5f8a6d7c9aca771347d1428e5de2ff07",
        "ContainerConfig": {
            "Hostname": "",
            "Domainname": "",
            "User": "",
            "AttachStdin": false,
            "AttachStdout": false,
            "AttachStderr": false,
            "Tty": false,
            "OpenStdin": false,
            "StdinOnce": false,
            "Env": [
                "PATH=/root/.nvm/versions/node/v16.16.0/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
                "DEBIAN_FRONTEND=noninteractive",
                "LANG=en_US.UTF-8",
                "LANGUAGE=en_US:en",
                "LC_ALL=en_US.UTF-8",
                "HOME=/root",
                "NVM_DIR=/root/.nvm",
                "NODE_PATH=/root/.nvm/versions/node/v16.16.0/lib/node_modules"
            ],
            "Cmd": [
                "/bin/sh",
                "-c",
                "bundle config mirror.https://rubygems.org https://gems.ruby-china.com"
            ],
            "Image": "sha256:bda5206bd5afc0493a70c281872760a9eaed00e20b804178d955a2db3b739b63",
            "Volumes": null,
            "WorkingDir": "",
            "Entrypoint": null,
            "OnBuild": null,
            "Labels": null
        },
        "DockerVersion": "20.10.8",
        "Author": "",
        "Config": {
            "Hostname": "",
            "Domainname": "",
            "User": "",
            "AttachStdin": false,
            "AttachStdout": false,
            "AttachStderr": false,
            "Tty": false,
            "OpenStdin": false,
            "StdinOnce": false,
            "Env": [
                "PATH=/root/.nvm/versions/node/v16.16.0/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
                "DEBIAN_FRONTEND=noninteractive",
                "LANG=en_US.UTF-8",
                "LANGUAGE=en_US:en",
                "LC_ALL=en_US.UTF-8",
                "HOME=/root",
                "NVM_DIR=/root/.nvm",
                "NODE_PATH=/root/.nvm/versions/node/v16.16.0/lib/node_modules"
            ],
            "Cmd": [
                "/sbin/my_init"
            ],
            "ArgsEscaped": true,
            "Image": "sha256:bda5206bd5afc0493a70c281872760a9eaed00e20b804178d955a2db3b739b63",
            "Volumes": null,
            "WorkingDir": "",
            "Entrypoint": null,
            "OnBuild": null,
            "Labels": null
        },
        "Architecture": "amd64",
        "Os": "linux",
        "Size": 970877762,
        "VirtualSize": 970877762,
        "GraphDriver": {
            "Data": {
                "LowerDir": "/var/lib/docker/overlay2/xxx/diff:/var/lib/docker/overlay2/xxx/diff:/var/lib/docker/overlay2/xxx/diff:/var/lib/docker/overlay2/xxx/diff:/var/lib/docker/overlay2/xxx/diff:/var/lib/docker/overlay2/xxx/diff:/var/lib/docker/overlay2/xxx/diff:/var/lib/docker/overlay2/xxx/diff:/var/lib/docker/overlay2/xxx/diff:/var/lib/docker/overlay2/xxx/diff:/var/lib/docker/overlay2/xxx/diff:/var/lib/docker/overlay2/xxx/diff:/var/lib/docker/overlay2/xxx/diff:/var/lib/docker/overlay2/xxx/diff",
                "MergedDir": "/var/lib/docker/overlay2/ec06a53e9b83aff4cb842c1f90585745a5fcc42f19f5d8060502e235a34846a0/merged",
                "UpperDir": "/var/lib/docker/overlay2/ec06a53e9b83aff4cb842c1f90585745a5fcc42f19f5d8060502e235a34846a0/diff",
                "WorkDir": "/var/lib/docker/overlay2/ec06a53e9b83aff4cb842c1f90585745a5fcc42f19f5d8060502e235a34846a0/work"
            },
            "Name": "overlay2"
        },
        "RootFS": {
            "Type": "layers",
            "Layers": [
                "sha256:4942a1abcbfa1c325b1d7ed93d3cf6020f555be706672308a4a4a6b6d631d2e7",
                "sha256:4a2fefbbad702f9b5eefa44b3dbcc24f04b6f1843cd63905236108e35e863981",
                "sha256:5d0cc7803677ec11de529e99ce5a2cc046c0fcf280f299f36e856dddaf176eab",
                "sha256:1f77c22c7dc68b6136f1c7baa052eb0aebf1a4769b3e89e597ce2991f06cd4b2",
                "sha256:93daae3503f263ed3fb4d7c82115611025e0cdd8bd09715bb34a7afdb3e4a755",
                "sha256:c9feca2e76e0c7f40e64dbdcc1af326212b0ad2eee22e71c6b3f99f51170e27d",
                "sha256:f022eb2c20e7281840efe4b1831a2e078deb288d53f36de270f417e884b9fca4",
                "sha256:161013a06fe5d3a505610cd2e16cb13ede5f92c0d4d261e066b08f19dbcc7dd4",
                "sha256:75168c43e5d61aac9434654f7f0c9f90bb0f64626465e721cbe93f6440e67225",
                "sha256:0cf0120a70a4043065c56962d26463afea2bac472e46e796083aee70c89e6583",
                "sha256:7e7cc8b93fec8ba8f90e0c8400f3834a4c7284537238bce17b3fe40e7f62c62e",
                "sha256:0fc1cae7cc8352fe14255c09d5772f3b74360a10cacb70963f610c570a6b3c34",
                "sha256:4e7f2a14577c2ec22b7d52e836aa34cf766ee49c47095bc7e0880b7de53bcd4d",
                "sha256:415e406a04c0ec9d94bffb21f7a3a153cc1d997316bb7e32173b737fbd329cb9",
                "sha256:9287ba4569ae4d3642ee0a8bf324a6fd6abfc14cc9967b8d13ddc48329b410b7"
            ]
        },
        "Metadata": {
            "LastTagTime": "0001-01-01T00:00:00Z"
        }
    }
]
```

可以清楚的看到该镜像的层和配置，输入 `docker history registry.cn-hangzhou.aliyuncs.com/alomerry/algorithm`

```text
IMAGE          CREATED         CREATED BY                                      SIZE      COMMENT
423a301d3603   9 days ago      /bin/sh -c bundle config mirror.https://ruby…   73B
[missing]      9 days ago      /bin/sh -c gem install bundler jekyll           212MB
[missing]      9 days ago      /bin/sh -c gem sources -a https://gems.ruby-…   12.9MB
[missing]      9 days ago      /bin/sh -c gem sources --remove https://ruby…   119B
[missing]      9 days ago      /bin/sh -c sed -i 's/#force_color_prompt/for…   3.3kB
[missing]      9 days ago      /bin/sh -c rm -rf /etc/cron.daily/apt           0B
[missing]      9 days ago      /bin/sh -c npm config set registry https://r…   2.02kB
[missing]      9 days ago      /bin/sh -c #(nop)  ENV PATH=/root/.nvm/versi…   0B
[missing]      9 days ago      /bin/sh -c #(nop)  ENV NODE_PATH=/root/.nvm/…   0B
[missing]      9 days ago      /bin/sh -c . ${NVM_DIR}/nvm.sh && nvm instal…   117MB
[missing]      9 days ago      /bin/sh -c #(nop)  ENV NVM_DIR=/root/.nvm       0B
[missing]      9 days ago      /bin/sh -c curl -s https://cdn.alomerry.com/…   1.34MB
[missing]      9 days ago      /bin/sh -c rm -rf /var/lib/apt/lists/* /var/…   0B
[missing]      9 days ago      /bin/sh -c apt-get clean                        0B
[missing]      9 days ago      /bin/sh -c DEBIAN_FRONTEND="noninteractive" …   342MB
[missing]      9 days ago      /bin/sh -c apt-get update                       61.4MB
[missing]      9 days ago      /bin/sh -c #(nop)  ENV LC_ALL=en_US.UTF-8       0B
[missing]      9 days ago      /bin/sh -c #(nop)  ENV LANGUAGE=en_US:en        0B
[missing]      9 days ago      /bin/sh -c #(nop)  ENV LANG=en_US.UTF-8         0B
[missing]      9 days ago      /bin/sh -c #(nop)  ENV HOME=/root               0B
[missing]      9 days ago      /bin/sh -c #(nop)  ENV DEBIAN_FRONTEND=nonin…   0B
[missing]      10 months ago   CMD ["/sbin/my_init"]                           0B        buildkit.dockerfile.v0
[missing]      10 months ago   ENV DEBIAN_FRONTEND=teletype LANG=en_US.UTF-…   0B        buildkit.dockerfile.v0
[missing]      10 months ago   RUN |1 QEMU_ARCH= /bin/sh -c /bd_build/prepa…   151MB     buildkit.dockerfile.v0
[missing]      10 months ago   COPY . /bd_build # buildkit                     40.4kB    buildkit.dockerfile.v0
[missing]      10 months ago   ARG QEMU_ARCH                                   0B        buildkit.dockerfile.v0
[missing]      10 months ago   /bin/sh -c #(nop)  CMD ["bash"]                 0B
[missing]      10 months ago   /bin/sh -c #(nop) ADD file:d2abf27fe2e8b0b5f…   72.8MB
```

**SIZE** 列展示了每一层的大小。
:::

![merge-layer](/img/in-post/2022-04-27/merge-layer.gif)
![multi-run-create-new-layer](/img/in-post/2022-04-27/multi-run-create-new-layer.gif)

- https://itnext.io/3-simple-tricks-for-smaller-docker-images-f0d2bda17d1e

### Best Prictice

尽量合并指令避免过多 layer
COPY 不需要预先创建父目录
优先使用 COPY 而不是 ADD

镜像最小化

仅安装必要的软件和文件
例如，如果需要便捷的 COPY . /workspace/，则可以通过在目录下添加 .dockerignore 文件来忽略不需要打包进镜像的文件，参考这里 (opens new window)。

#充分利用镜像之间的缓存共享
对于 ADD/COPY 命令，只有 COPY 文件的 cksum 发生变化，才会重新执行，不然则会利用上次的缓存。
对于 RUN 命令，如果本地任何镜像中存在相同的文件层，则会直接重用。所谓相同，指继承于相同的父镜像、且该命令之前从 FROM 开始执行了相同的会影响文件层的构建命令(RUN、COPY、ADD 等)。
如果有依赖包安装步骤，例如 yarn install，不要一次性 COPY 整个源码目录（目录下任何一个文件变化都会造成缓存失效），而应该先 COPY yarn.lock /workspace/ 然后执行 RUN yarn install，再 COPY . /workspace，如此只要依赖定义文件 yarn.lock 不变（大多数情况），就可利用缓存而不需要从头 yarn install，更多信息可参考这里 (opens new window)。

在 RUN 命令里添加的临时文件必须在这条命令的最后删除
正例：

RUN wget -q https://srepublic.oss-cn-hangzhou.aliyuncs.com/packages/xxx/xxx.tar.gz && \
    tar -xf package.tar.gz && \
    cd package && \
    ./configure && make && make install &&
    rm -rf ../package
反例：

RUN wget https://srepublic.oss-cn-hangzhou.aliyuncs.com/packages/xxx/xxx.tar.gz && \
    tar -xf package.tar.gz && \
    cd package && \
    ./configure && make && make install
RUN rm -rf ../package

如果通过解压 tar.gz 文件用于编译安装软件，例如编译安装 openresty，不建议直接将 tar.gz 文件 ADD 进镜像中（ADD 后将无法再通过 RUN rm 命令清除占用的空间，则会增大最后的镜像的大小），建议将 tar.gz 放在 OSS srepublic 上，通过在一条 RUN 命令中完成下载、解压、编译安装最后删除的过程。
下载文件统一用 wget -q 而不是 curl。
解压缩统一用 tar -xf，不要加 -v 以减少输出，不用加 -z 因为会自动检测，必要的话可以加 -C [dir] 指定解压到的目录

在 RUN 指令中慎用 chmod 和 chown
他们会产生额外的文件层，chmod 命令可以在源文件上执行，COPY 的时候权限会被保留。


### Case 

优化一个 dockerfile

下面是一个 alomerry/algorithm 项目初期的构建版本：

通过上面的学习，可以来优化一下：

:::tip
jekyll 构建时会忽略时间是未来的 markdown，基础镜像中默认是 UTC，docker run 的时候最好加上

```
-v /etc/timezone:/etc/timezone:ro -v /etc/localtime:/etc/localtime:ro
```
:::

## Docker Remote / Docker Context

- https://medium.com/@ssmak/how-to-enable-docker-remote-api-on-docker-host-7b73bd3278c6#id_token=eyJhbGciOiJSUzI1NiIsImtpZCI6ImZjYmQ3ZjQ4MWE4MjVkMTEzZTBkMDNkZDk0ZTYwYjY5ZmYxNjY1YTIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJuYmYiOjE2NTIxMDg0NzEsImF1ZCI6IjIxNjI5NjAzNTgzNC1rMWs2cWUwNjBzMnRwMmEyamFtNGxqZGNtczAwc3R0Zy5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjExMTMyMDE5MjA0ODQ2NTAxMjE3NSIsImVtYWlsIjoibW9yaXp1bnpodUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXpwIjoiMjE2Mjk2MDM1ODM0LWsxazZxZTA2MHMydHAyYTJqYW00bGpkY21zMDBzdHRnLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwibmFtZSI6Iua4heasoiIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS0vQU9oMTRHaWR5Zlg5bk1TQ21nVDlDVUlnVFU1TVU4U0l2N1ZoTVJmbmx6ZFE9czk2LWMiLCJnaXZlbl9uYW1lIjoi5qyiIiwiZmFtaWx5X25hbWUiOiLmuIUiLCJpYXQiOjE2NTIxMDg3NzEsImV4cCI6MTY1MjExMjM3MSwianRpIjoiYzllMGJiZmUwODcyNmRmZmU4N2QzYmQxOTM1MjJjZDU5Njg1ZTY0NiJ9.BJRDLMedLlM5Lw4723iiyYUf_ytHHoaDktIC53v4dmFSYmqnqSWQaLT1YrB3z8qKury5-FfyRZLqPQ000ynOIu_rD0FkQepIj0wO0sIMHpdCzkRnOZRRuBkcggv0RKhTvRUn00m5-hobPpEHXFEPpAS3DfXbkmcOu6SjUIm7LqcfX0_8O-MrZYdjis4JCUGXP7jFrdUyhpEqaNIV8oXGZX1Zjy5r4t3JXLVem0TnZVcsJIpEOF7nLF9U8UzEZ72DuSK6RKFMwRbXDoQqEpSlXeE0r8X5ZFVGlUjD6vql_u2rX95Oj8mxCjHSTkFE9mng5_tUpzgSP1md2FK4ff9WbQ
- https://blog.csdn.net/u013670453/article/details/115971259
- https://www.docker.com/blog/how-to-deploy-on-remote-docker-hosts-with-docker-compose/

## 常用

### docker 避免一直 sudo

- `sudo groupadd docker` 创建组
- `sudo gpasswd -a ${USER} docker`将用户添加到该组，例如 xxx 用户
- `sudo systemctl restart docker`重启 docker-daemon
  newgrp docker

### 拷贝容器文件到宿主机

`docker cp <containerId>:<fileName> <hostPath>`


## Additional Resources

- https://www.timiguo.com/archives/223/
## Reference

<!-- [^aliyun-docker-register] : [xxx](xxx) -->
[^install-docker]: [install docker](https://docs.docker.com/engine/install/ubuntu/)
[^install-docker-compose]: [install docker compose](https://docs.docker.com/compose/install/)
[^docker-document]: [docker document](https://docs.docker.com/get-started/overview/)
[^images-and-layers]: [images and layers](https://docs.docker.com/storage/storagedriver/#images-and-layers)
[^container-and-layers]: [container and layers](https://docs.docker.com/storage/storagedriver/#container-and-layers)
[^use-multi-stage-builds]: [use multi-stage builds](https://docs.docker.com/develop/develop-images/multistage-build/)
[^best-practices-for-writing-Dockerfiles]: [Best practices for writing Dockerfiles](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)

## 扩展

- [build-essential 的作用](https://blog.csdn.net/yuhengyue/article/details/78132175)