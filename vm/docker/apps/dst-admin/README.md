# 饥荒独立服务器部署面板Docker镜像

- https://github.com/kairlec/dst-admin-go-docker/blob/main/dst-admin-go/Dockerfile
- https://github.com/hujinbo23/dst-admin-go
- https://flowus.cn/share/49c11842-2392-4627-b6c4-a4002965cd65
- https://flowus.cn/share/ed2f7999-b1d4-4d60-9c4d-509ffa578c5a

## 部署

- docker compose 示例
    ```yaml
    version: '3'
    services:
      dst-admin-go:
        image: kairlec/dst-admin-go:${TAG:-latest}
        deploy:
          restart_policy:
            condition: always
            delay: 5s
            window: 60s
        container_name: dst-admin-go
        volumes:
          - ./dst-admin-go/saves:/root/.klei/DoNotStarveTogether # 游戏存档
          - ./dst-admin-go/backup:/app/backup # 游戏备份
          - ./dst-admin-go/mods:/app/mod # 游戏 mod
        ports:
          - 8082:8082/tcp # for web dashboard
          - 10888:10888/udp
          - 10998:10998/udp
          - 10999:10999/udp
    ```
  请自行修改TAG为相应版本号,latest构建使用最新代码构建可能并不稳定
  
  ---
  - 玩家日志存在`/app/dst-db`文件,如果需要持久化,建议先启动一次,然后使用`docker cp`命令将文件复制出来,然后再修改compose文件再次启动
  - 服务日志存在`/app/dst-admin-go.log`文件,如果需要持久化,建议先启动一次,然后使用`docker cp`命令将文件复制出来,然后再修改compose文件再次启动
  - 系统设置存在`/app/dst_config`,如果需要持久化,建议先启动一次,然后使用`docker cp`命令将文件复制出来,然后再修改compose文件再次启动
  - 如果不希望在重新创建容器后,用户都需要重新创建,可以启动一次后初始化完毕,然后将`/app/password.txt`文件复制出来,然后再修改compose文件,并挂载一个文件(任意,空文件就行)到`/app/first`,再次启动即可
- docker run 示例
  ```shell
  docker run -d --name dst-admin-go \
    -v ./dst-admin-go/saves:/root/.klei/DoNotStarveTogether \
    -v ./dst-admin-go/backup:/app/backup \
    -v ./dst-admin-go/mods:/app/mod \
    -p 8082:8082/tcp \
    -p 10888:10888/udp \
    -p 10998:10998/udp \
    -p 10999:10999/udp \
    --restart=always \
    kairlec/dst-admin-go:${TAG:-latest}
  ```
