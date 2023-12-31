# Deploy k8s 1.28.1 on PVE 8.1.3

## Install 

- apt install
  - apt-transport-https
  - ca-certificates
  - curl
  - conntrack
- docker
- [crictl](https://github.com/kubernetes-sigs/cri-tools/releases/download/v1.28.0/crictl-v1.28.0-linux-amd64.tar.gz)
- [kubectl](https://dl.k8s.io/release/v1.28.1/bin/linux/amd64/kubectl) `install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl`
- [kubeadm](https://dl.k8s.io/release/v1.28.1/bin/linux/amd64/kubeadm) `install -o root -g root -m 0755 kubeadm /usr/local/bin/kubeadm`
- [kubelet](https://dl.k8s.io/release/v1.28.1/bin/linux/amd64/kubelet) `install -o root -g root -m 0755 kubelet /usr/local/bin/kubelet`
- [cni-plugins](https://github.com/containernetworking/plugins/releases/download/v1.3.0/cni-plugins-linux-amd64-v1.3.0.tgz)

## Configurate

- 【成功安装 ！！！！！！】https://blog.frognew.com/2023/08/kubeadm-install-kubernetes-1.28.html

## 多次迁移，决定使用 oss

初步决定使用 七牛云 https://developer.qiniu.com/kodo/12348/use-kubernetes-csi-kodo-mount-object-storage 

### 使用 Kubernetes CSI 挂载对象存储 Kodo

- 安装 Kodo CSI 驱动  `kubectl create -f https://github.com/qiniu/kubernetes-csi-driver/releases/download/v0.1.3/kodo-plugin.yaml`

secret

```yml
apiVersion: v1
   metadata:
     name: kodo-csi-pv-secret                 # Secret 名称，可以修改
   kind: Secret
   type: Opaque
   data:
     accesskey: "<Qiniu Access Key>"          # 必填, 必须是 BASE64 格式
     secretkey: "<Qiniu Secret Key>"          # 必填, 必须是 BASE64 格式
   stringData:
     bucketname: "<bucketname>"               # 必填
     ucendpoint: "<ucendpoint>"               # 必填 在公有云中，该字段可以填写为 https://kodo-config.qiniuapi.com
     storageclass: "STANDARD"                 # 可选 默认为 STANDARD，可选值为 STANDARD，LINE，GLACIER，DEEP_ARCHIVE
     region: "z0"                             # 可选 默认为 z0 代表华东区
     subdir: ""                               # 可选 仅挂载子目录，适用于通过 Bucket Policy 授权子目录的用户
     s3forcepathstyle: "false"                # 可选 是否仅使用 Path Style 调用 S3 API，适用于私有云环境
```

pv

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: kodo-csi-pv                        # PV 名称，可以修改
  labels:
    kodo-pvname: kodo-csi-pv               # PVC 匹配用的标签，可以修改
spec:
  capacity:
    storage: 5Gi                           # 空间大小，可以修改
  accessModes:
    - ReadWriteMany
  persistentVolumeReclaimPolicy: Retain    # 无需修改，Kodo CSI 驱动只支持 Retain 策略
  csi:
    driver: kodoplugin.storage.qiniu.com
    volumeHandle: kodo-csi-pv              # 指定为上面的 PV 名称
    volumeAttributes:
       uploadcutoff: "209715200"    # 分片上传阈值，大于该阈值的文件将自动使用分片的形式上传，单位为字节。默认为 200 MB，最小值为 0，最大不能超过 5 GB。       
       uploadchunksize: "5242880"   # 分片大小，单位为字节，默认为 5 MB。对于大文件而言，适当提高分片大小将有效提升上传效率。
       uploadconcurrency: "4"      # 分片上传并发度，默认为 4。   
       vfscachemode: "off"           # 本地缓存模式，可选值为 off，minimal，writes，full。     
       dircacheduration: "5m0s"       # 目录缓存时长，默认为 5m0s。当列举目录时，如果目录没有缓存或缓存已经失效，则会从云存储列举，然后刷新缓存。    
       buffersize: "16777216"           # 文件内存缓冲区最大尺寸，单位为字节，默认为 16 MB。当文件被下载时，数据将被读入内存缓冲区等待读请求来获取。  
       vfsreadahead: "0" # 额外预读取大小，单位为字节，默认为 0。仅在 vfscachemode 为 full 时，当文件被下载时，buffersize 大小的数据将被读取到内存缓冲区等待读取，之后的 vfsreadahead 大小的数据则被读取到本地缓存中等待读取。    
       vfscachemaxage: "1h0m0s" #  本地缓存时长，默认为 1h0m0s。当本地缓存被启用时，缓存的数据最长有效期，超过有效期的数据将被自动删除。       
       vfscachemaxsize: "off" # 最大本地缓存尺寸，默认为 off。            
       vfscachepollinterval: "1m0s" # 清理缓存频率，默认为 1m0s。
       vfswriteback: "5s" # 本地缓存上传延迟时长，默认为 5s。 当本地写缓存被启用时，被写入的文件仅在被关闭后，且在延迟时长内没有被再打开的数据才会被上传到云存储。
       vfsreadchunksize: "134217728" # 首次下载分片大小，单位为字节，默认为 128 MB。 当 vfsreadchunksize 大于 0 时，文件总是以分片的形式被下载，且每次下载的分片被读取完毕后，下次下载的分片大小是前一次的两倍，直到分片大小达到 vfsreadchunksizelimit 或文件被下载完毕为止。
       vfsreadchunksizelimit: "off" # 最大下载分片大小，单位为字节，默认为 off。当下载的分片大小不断翻倍直到大于等于 vfsreadchunksizelimit 后，之后每次下载的分片大小总是等于 vfsreadchunksizelimit，直到文件被下载完毕为止。
       nochecksum: "no" # 上传下载时不再校验数据，默认为总是校验数据。
       nomodtime: "no" # 不再读写文件修改时间，默认为总是读写文件修改时间。禁止读写文件修改时间可以提升文件系统的性能。
       noseek: "no" # 禁止文件寻址，默认为允许文件寻址。统。                     
       readonly: "no" # 只读文件系统，默认为可以修改文件系              
       transfers: "4" # 本地缓存上传并发度，默认为 4。当本地写缓存被启用时，异步上传文件的并发度。
    nodePublishSecretRef:
      name: kodo-csi-pv-secret             # 指定 Secret 名称
      namespace: default
```

pvc

```yml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: kodo-pvc                           # PVC 名称，可以修改
spec:
  accessModes:
  - ReadWriteMany
  storageClassName: ''
  resources:
    requests:
      storage: 5Gi                         # 申请空间大小，可以修改
  selector:
    matchLabels:
      kodo-pvname: kodo-csi-pv             # 匹配 PV 的标签
```

https://github.com/qiniu/kubernetes-csi-driver csi-driver
kubectl create -f ./csi-driver/examples/kodo/static-provisioning

## [重载沙箱（pause）镜像](https://kubernetes.io/zh-cn/docs/setup/production-environment/container-runtimes/#override-pause-image-containerd)

## init master

- master init 前不需要启动 kubelet
- kubeadm config print init-defaults --component-configs KubeProxyConfiguration,KubeletConfiguration > kubeadm-config.yaml
- 预拉取镜像 kubeadm config images pull --config kubeadm-config.yaml

```shell
kubeadm reset

kubeadm init \
  --apiserver-advertise-address=192.168.31.199 \
  --image-repository registry.aliyuncs.com/google_containers \
  --kubernetes-version v1.28.1 \
  --service-cidr=10.1.0.0/16 \
  --pod-network-cidr=10.244.0.0/16 \
  --cri-socket=unix:///var/run/containerd/containerd.sock
```

```shell
kubeadm token create --print-join-command

kubeadm join 192.168.31.199:6443 --token 6fkbrf.8djkchf5kdi9jhmp \
	--discovery-token-ca-cert-hash sha256:b9767dd663d847480470fb4846bdd446d271b7063e3c39faba72
```


export KUBECONFIG=/etc/kubernetes/admin.conf

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

- https://kubernetes.io/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init/

## xx

https://github.com/flannel-io/flannel#flannel

- kubectl kubeadm kubelem fannel cert-manager ingress-nginx

## Reference

- https://kubernetes.io/zh-cn/docs/tasks/tools/install-kubectl-linux/
- https://kubernetes.io/zh-cn/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#installing-kubeadm-kubelet-and-kubectl
- https://developer.aliyun.com/mirror/kubernetes
- https://windcoder.com/shiyong-kubeadm-anzhuangjiyu-containerd-de-kubernetes-jiqun
