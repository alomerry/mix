# k8s 1.28.1 on PVE 8.1.3 安装手册

## Prepare

- PVE 8.1.3
- Ubuntu 22.04 虚拟机若干

## 安装 k8s 1.28.1

安装依赖

```shell
apt-get install -y apt-transport-https \
  ca-certificates \
  curl \
  conntrack
```

安装容器运行时

- runc

  ```shell
  RUNC_VERSION=${RUNC_VERSION:-"1.1.12"}
  wget https://github.com/opencontainers/runc/releases/download/v$RUNC_VERSION/runc.amd64 -qO /tmp/containerd/runcamd64
  install -m 755 /tmp/containerd/runc.amd64 /usr/local/sbin/runc
  ```

- containerd

  ::: details

  ```shell
  CONTAINERD_VERSION=${CONTAINERD_VERSION:-"1.7.11"}
  rm -rf /tmp/containerd/*
  mkdir -p /tmp/containerd
  wget https://github.com/containerd/containerd/releases/download/v$CONTAINERD_VERSION/containerd-$CONTAINERD_VERSION-linux-amd64.tar.gz -qO /tmp/containerd/containerd-$CONTAINERD_VERSION-linux-amd64.tar.gz
  tar -xzf "/tmp/containerd/containerd-$CONTAINERD_VERSION-linux-amd64.tar.gz" -C /usr/local
  mkdir -p /usr/local/lib/systemd/system/
  mkdir -p /etc/containerd
  containerd config default > /etc/containerd/config.toml

  # 修改配置文件
  # - SystemdCgroup = true
  # - sandbox_image = "registry.aliyuncs.com/google_containers/pause:3.9"
  wget https://raw.githubusercontent.com/alomerry/mix/master/vm/scripts/pve/k8s/etc-containerd-config.toml -qO /etc/containerd/config.toml
  wget https://raw.githubusercontent.com/containerd/containerd/main/containerd.service -qO /etc/systemd/system/containerd.service
  systemctl daemon-reload
  systemctl enable containerd --now
  systemctl status containerd
  ```

  - 创建 `/etc/modules-load.d/containerd.conf` 配置文件，确保在系统启动时自动加载所需的内核模块，以满足容器运行时的要求

    ```shell
    cat << EOF > /etc/modules-load.d/containerd.conf
    overlay
    br_netfilter
    EOF

    modprobe overlay
    modprobe br_netfilter
    ```

  - 创建 `/etc/sysctl.d/99-kubernetes-cri.conf`

    ```shell
    cat << EOF > /etc/sysctl.d/99-kubernetes-cri.conf
    net.bridge.bridge-nf-call-ip6tables = 1
    net.bridge.bridge-nf-call-iptables = 1
    net.ipv4.ip_forward = 1
    user.max_user_namespaces=28633
    EOF

    sysctl -p /etc/sysctl.d/99-kubernetes-cri.conf
    sysctl net.bridge.bridge-nf-call-iptables net.bridge.bridge-nf-call-ip6tables net.ipv4.ip_forward
    sysctl --system

    # 确认 br_netfilter 和 overlay 模块被加载
    lsmod | grep br_netfilter
    lsmod | grep overlay
    ```
  
  :::

使用 [aliyun 镜像]((https://developer.aliyun.com/mirror/kubernetes))安装 kubeadm、kubelet、kubectl

```shell
curl -s https://mirrors.aliyun.com/kubernetes/apt/doc/apt-key.gpg | apt-key add -
tee /etc/apt/sources.list.d/kubernetes.list <<-'EOF'
deb https://mirrors.aliyun.com/kubernetes/apt/ kubernetes-xenial main
EOF

apt-get update
apt-get install -y kubelet=1.28.1-00 kubeadm=1.28.1-00 kubectl=1.28.1-00
apt-mark hold kubelet kubeadm kubectl
systemctl enable kubelet.service
```

初始化 master 节点

```shell
kubeadm reset

kubeadm init \
  --apiserver-advertise-address=192.168.31.? \
  --image-repository registry.aliyuncs.com/google_containers \
  --kubernetes-version v1.28.1 \
  --service-cidr=10.1.0.0/16 \
  --pod-network-cidr=10.244.0.0/16 \
  --cri-socket=unix:///var/run/containerd/containerd.sock
```

::: details Result

```shell
[init] Using Kubernetes version: v1.28.1
[preflight] Running pre-flight checks
[preflight] Pulling images required for setting up a Kubernetes cluster
[preflight] This might take a minute or two, depending on the speed of your internet connection
[preflight] You can also perform this action in beforehand using 'kubeadm config images pull'
[certs] Using certificateDir folder "/etc/kubernetes/pki"
[certs] Generating "ca" certificate and key
[certs] Generating "apiserver" certificate and key
[certs] apiserver serving cert is signed for DNS names [home kubernetes kubernetes.default kubernetes.default.svc kubernetes.default.svc.cluster.local] and IPs [10.0.0.1 192.168.3.110]
[certs] Generating "apiserver-kubelet-client" certificate and key
[certs] Generating "front-proxy-ca" certificate and key
[certs] Generating "front-proxy-client" certificate and key
[certs] Generating "etcd/ca" certificate and key
[certs] Generating "etcd/server" certificate and key
[certs] etcd/server serving cert is signed for DNS names [home localhost] and IPs [192.168.3.110 127.0.0.1 ::1]
[certs] Generating "etcd/peer" certificate and key
[certs] etcd/peer serving cert is signed for DNS names [home localhost] and IPs [192.168.3.110 127.0.0.1 ::1]
[certs] Generating "etcd/healthcheck-client" certificate and key
[certs] Generating "apiserver-etcd-client" certificate and key
[certs] Generating "sa" key and public key
[kubeconfig] Using kubeconfig folder "/etc/kubernetes"
[kubeconfig] Writing "admin.conf" kubeconfig file
[kubeconfig] Writing "kubelet.conf" kubeconfig file
[kubeconfig] Writing "controller-manager.conf" kubeconfig file
[kubeconfig] Writing "scheduler.conf" kubeconfig file
[etcd] Creating static Pod manifest for local etcd in "/etc/kubernetes/manifests"
[control-plane] Using manifest folder "/etc/kubernetes/manifests"
[control-plane] Creating static Pod manifest for "kube-apiserver"
[control-plane] Creating static Pod manifest for "kube-controller-manager"
[control-plane] Creating static Pod manifest for "kube-scheduler"
[kubelet-start] Writing kubelet environment file with flags to file "/var/lib/kubelet/kubeadm-flags.env"
[kubelet-start] Writing kubelet configuration to file "/var/lib/kubelet/config.yaml"
[kubelet-start] Starting the kubelet
[wait-control-plane] Waiting for the kubelet to boot up the control plane as static Pods from directory "/etc/kubernetes/manifests". This can take up to 4m0s
[apiclient] All control plane components are healthy after 4.001712 seconds
[upload-config] Storing the configuration used in ConfigMap "kubeadm-config" in the "kube-system" Namespace
[kubelet] Creating a ConfigMap "kubelet-config" in namespace kube-system with the configuration for the kubelets in the cluster
[upload-certs] Skipping phase. Please see --upload-certs
[mark-control-plane] Marking the node home as control-plane by adding the labels: [node-role.kubernetes.io/control-plane node.kubernetes.io/exclude-from-external-load-balancers]
[mark-control-plane] Marking the node home as control-plane by adding the taints [node-role.kubernetes.io/control-plane:NoSchedule]
[bootstrap-token] Using token: 60ou8b.lf0cah9vejzud6y9
[bootstrap-token] Configuring bootstrap tokens, cluster-info ConfigMap, RBAC Roles
[bootstrap-token] Configured RBAC rules to allow Node Bootstrap tokens to get nodes
[bootstrap-token] Configured RBAC rules to allow Node Bootstrap tokens to post CSRs in order for nodes to get long term certificate credentials
[bootstrap-token] Configured RBAC rules to allow the csrapprover controller automatically approve CSRs from a Node Bootstrap Token
[bootstrap-token] Configured RBAC rules to allow certificate rotation for all node client certificates in the cluster
[bootstrap-token] Creating the "cluster-info" ConfigMap in the "kube-public" namespace
[kubelet-finalize] Updating "/etc/kubernetes/kubelet.conf" to point to a rotatable kubelet client certificate and key
[addons] Applied essential addon: CoreDNS
[addons] Applied essential addon: kube-proxy

Your Kubernetes control-plane has initialized successfully!

To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config
Alternatively, if you are the root user, you can run:

  export KUBECONFIG=/etc/kubernetes/admin.conf

You should now deploy a pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  https://kubernetes.io/docs/concepts/cluster-administration/addons/

Then you can join any number of worker nodes by running the following on each as root:

kubeadm join 192.168.31.253:6443 --token by2cw3.1jx90j1ru6qbuvxv \
  --discovery-token-ca-cert-hash sha256:73a66e38f8f1a2efa1c40da1842ec69f39495c5df46f73f7f15af285c073b7b0
```

:::

从节点接入

```shell
kubeadm token create --print-join-command

kubeadm join 192.168.31.?:6443 --token 6fkbrf.8djkchf5kdi9jhmp \
  --discovery-token-ca-cert-hash sha256:b9767dd663d847480470fb4846bdd446d271b7063e3c39faba72
```

安装 [flannel](https://github.com/flannel-io/flannel#flannel)、cert-manager、ingress-nginx

```shell
mkdir -p /root/k8s/
wget https://raw.githubusercontent.com/alomerry/mix/master/vm/scripts/pve/k8s/apply/flannel.yml -qO /root/k8s/flannel.yml
wget https://raw.githubusercontent.com/alomerry/mix/master/vm/scripts/pve/k8s/apply/cert-manager.yml -qO /root/k8s/cert-manager.yml

export KUBECONFIG=/etc/kubernetes/admin.conf

kubectl apply -f /root/k8s/flannel.yml
kubectl apply -f /root/k8s/cert-manager.yml
```

## 安装 nfs 为 k8s 集群提供存储服务

在 PVE 宿主机安装 server 端

```shell
apt install nfs-kernel-server -y
systemctl start nfs-kernel-server
systemctl enable nfs-kernel-server
mkdir -p /mnt/share
chown nobody:nogroup /mnt/share
chmod 755 /mnt/share
vim /etc/exports
# 挂载服务硬盘 /mnt/share 192.168.31.0/24(rw,sync,no_root_squash,no_subtree_check)
exportfs -arv
ufw allow from 192.168.31.0/24 to any port nfs
ufw reload
```

在 k8s 中安装 [csi-driver-nfs](https://github.com/kubernetes-csi/csi-driver-nfs/blob/master/docs/install-csi-driver-v4.6.0.md)

```shell
kubectl apply -f rbac-csi-nfs.yaml
kubectl apply -f csi-nfs-driverinfo.yaml
kubectl apply -f csi-nfs-controller.yaml
kubectl apply -f csi-nfs-node.yaml
```

::: details 卸载

```shell
kubectl delete -f csi-nfs-controller.yaml --ignore-not-found
kubectl delete -f csi-nfs-node.yaml --ignore-not-found
kubectl delete -f csi-nfs-driverinfo.yaml --ignore-not-found
kubectl delete -f rbac-csi-nfs.yaml --ignore-not-found
```

:::

创建 storage class

```yml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: nfs-csi
provisioner: nfs.csi.k8s.io
parameters:
  # nfs-server.default.svc.cluster.local
  server: 192.168.31.2
  share: /mnt/pve/nvme_1T/k8s
  # csi.storage.k8s.io/provisioner-secret is only needed for providing mountOptions in DeleteVolume
  # csi.storage.k8s.io/provisioner-secret-name: "mount-options"
  # csi.storage.k8s.io/provisioner-secret-namespace: "default"
reclaimPolicy: Delete
volumeBindingMode: Immediate
mountOptions:
  - nfsvers=4.1
```

创建 PVC

```yml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: pvc-nfs-dynamic
spec:
  accessModes:
    - ReadWriteMany
  resources:
    requests:
      storage: 10Gi
  storageClassName: nfs-csi
```

## Reference

- [使用 kubeadm 部署 Kubernetes 1.28](https://blog.frognew.com/2023/08/kubeadm-install-kubernetes-1.28.html)
- [二进制安装Kubernetes（k8s）v1.28.0](https://www.modb.pro/db/1693464982470086656)
- [重载沙箱（pause）镜像](https://kubernetes.io/zh-cn/docs/setup/production-environment/container-runtimes/#override-pause-image-containerd)
- [在 Linux 系统中安装并设置 kubectl](https://kubernetes.io/zh-cn/docs/tasks/tools/install-kubectl-linux/)
- [Ubuntu 20.04 中配置 NFS 服务](https://www.linuxprobe.com/ubuntu-configure-nfs.html)
- [How to Install NFS Server on Debian 12 Step-by-Step](https://www.linuxtechi.com/how-to-install-nfs-server-on-debian/#google_vignette)
- [csi driver example](https://github.com/kubernetes-csi/csi-driver-nfs/blob/master/deploy/example/README.md#csi-driver-example)
- [使用 NFS 的持久性存储](https://access.redhat.com/documentation/zh-cn/openshift_container_platform/4.3/html/storage/persistent-storage-using-nfs)
