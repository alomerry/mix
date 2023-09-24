---
article: false
---

# k8s

minikube start --image-mirror-country='cn' --docker-env no_proxy=localhost,127.0.0.1,192.168.59.0/24,192.168.39.0/24,192.168.49.0/24,10.96.0.0/12 --cpus 6 --memory 8192 --driver=docker



export HTTP_PROXY=http://127.0.0.1:8889
export HTTPS_PROXY=http://127.0.0.1:8889
export NO_PROXY=localhost,127.0.0.1,10.96.0.0/12,192.168.59.0/24,192.168.49.0/24,192.168.39.0/24

minikube start

// https://github.com/kubernetes/minikube/issues/15270
minikube start --image-mirror-country='cn' --kubernetes-version=v1.23.12 --cpus 6 --memory 8192


kubectl proxy --port=8001 --address=‘10.211.55.6’ --accept-hosts=’^.*’ &



https://blog.frognew.com/2023/08/kubeadm-install-kubernetes-1.28.html

https://kubernetes.feisky.xyz/troubleshooting/network
https://blog.csdn.net/NeverLate_gogogo/article/details/114098578
https://jimmysong.io/kubernetes-handbook/cloud-native/cloud-native-local-quick-start.html

凤凰架构 https://icyfenix.cn/

- https://kubernetes.io/zh-cn/docs/concepts/workloads/pods/init-containers/
- https://access.redhat.com/documentation/zh-cn/openshift_container_platform/4.4/html/storage/persistent-storage-using-hostpath
- https://www.cnblogs.com/v-fan/p/
- https://leohsiao.com/DevOps/%E5%AE%B9%E5%99%A8/k8s/Volume.html

## ingress nginx

- https://cloud.tencent.com/developer/article/1562688
- https://pj1987111.github.io/posts/k8s/nginx+ingress-controller%E8%A7%A3%E5%86%B3l7%E5%A4%96%E7%BD%91web%E6%9C%8D%E5%8A%A1%E6%9A%B4%E9%9C%B2%E5%92%8C%E8%B4%9F%E8%BD%BD%E5%9D%87%E8%A1%A1/
- https://cloud.tencent.com/developer/article/1856854


## others

- https://www.talkwithtrend.com/Question/438907
- https://zhuanlan.zhihu.com/p/594109163

## todo

重启

https://www.data2clouds.com/?p=210
https://blog.51cto.com/u_11555417/6065133

## 手册

https://cloud-atlas.readthedocs.io/zh_CN/latest/kubernetes/administer/remove_node.html