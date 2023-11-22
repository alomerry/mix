```sh
vim /etc/sysctl.conf
net.ipv4.ip_forward = 1
sysctl -p /etc/sysctl.conf
```

## port

`iptables -t nat -A PREROUTING -p tcp --dport 8080 -j DNAT --to-destination pod-ip:pod-port`

这个 iptables 命令用于在 nat 表中添加一条 PREROUTING 规则，实现对输入流量的目的地地址（Destination NAT，简称 DNAT）的修改，从而将流量转发到指定的 Pod 的 IP 地址和端口。下面是各个参数的解释：

- `iptables`: Linux 中用于配置 IPv4 数据包过滤规则的工具。
- `-t nat`: 指定要操作的表，这里是 nat 表，用于配置网络地址转换规则。
- `-A PREROUTING`: 表示在 PREROUTING 链（数据包进入路由之前的处理阶段）追加一条规则。
- `-p tcp`: 指定要匹配的协议类型，这里是 TCP。
- `--dport 8080`: 指定目标端口，即宿主机上监听的端口为 8080。
- `-j DNAT`: 指定要执行的动作，即进行目标地址的修改，采用目标网络地址转换 (DNAT)。
- -`-to-destination pod-ip:pod-port`: 指定 DNAT 的目标地址，即将流量转发到的 Pod 的 IP 地址和端口。替换 pod-ip 和 pod-port 为你实际的 Pod 的 IP 地址和端口。

总的来说，这个 iptables 命令的作用是将宿主机上进入 8080 端口的 TCP 流量重定向（转发）到指定的 Pod 的 IP 地址和端口。这样，宿主机上的服务就可以通过监听 8080 端口来访问集群中的 Pod。

## ips

如果你想将整个 IP 段（例如 10.244.0.0/16 和 10.1.0.0/16）的流量重定向到 Kubernetes 内部，并且希望在 Kubernetes 内部的路由处理这些流量，你可以使用以下 iptables 命令来实现：

`iptables -t nat -A PREROUTING -d <宿主机公共 IP> -j DNAT --to-destination <Kubernetes Cluster IP Range>`

iptables -t nat -A PREROUTING -d <宿主机公共 IP> -j DNAT --to-destination <Kubernetes Cluster IP Range>
iptables -t nat -A PREROUTING -d <宿主机公共 IP> -j DNAT --to-destination <Kubernetes Cluster IP Range>

请注意替换以下部分：

- <宿主机公共 IP>: 这是宿主机的公共 IP 地址，从外部访问该 IP 地址时，流量将被重定向到 Kubernetes 内部。
- <Kubernetes Cluster IP Range>: 这是你的 Kubernetes 集群的 IP 段，包括 Pod IP 段和 Service IP 段。在你的情况中，你需要将其设置为实际的 IP 段，比如 10.244.0.0/16,10.1.0.0/16。

这个规则将特定源 IP 段的流量重定向到指定的 Kubernetes Cluster IP Range。请确保仔细检查 IP 段和规则，以确保只有预期的流量被重定向。

iptables -t nat -A PREROUTING -d <宿主机公共 IP> -j DNAT --to-destination <Kubernetes Cluster IP Range>

## 

在 `iptables` 中查看、删除和覆盖规则的操作通常涉及使用不同的命令和选项。下面是一些关于如何在 `iptables` 中执行这些操作的常见命令和示例：

**1. 查看 `iptables` 规则:**

- 若要查看所有 `iptables` 规则，可以使用以下命令：
  
  ```bash
  sudo iptables -L
  ```

- 若要查看某个特定表（如nat、filter、mangle）中的规则，可以使用 `-t` 选项，例如：
  
  ```bash
  sudo iptables -t nat -L
  ```

**2. 删除 `iptables` 规则:**

- 若要删除一条规则，需要指定表（nat、filter、mangle）、链（INPUT、OUTPUT、FORWARD 等）以及规则规范。例如，删除某条 `nat` 表的 PREROUTING 链中的一条规则：

  ```bash
  sudo iptables -t nat -D PREROUTING <规则编号>
  ```

  `<规则编号>` 是要删除规则的编号，可以通过 `iptables -L` 命令查看规则的编号。

**3. 覆盖 `iptables` 规则:**

- 若要覆盖规则，通常需要先删除旧规则，然后添加新规则。你可以使用 `-R` 选项来替换现有规则。例如，要替换 `nat` 表中 PREROUTING 链中的规则：

  ```bash
  sudo iptables -t nat -R PREROUTING <规则编号> -j 新规则
  ```

  `<规则编号>` 是要替换的规则的编号，`-j` 后跟新规则。

请注意，要非常小心删除或覆盖规则，以免意外中断网络连接。确保在进行任何更改之前备份或记录当前的规则，以便在需要时进行还原。