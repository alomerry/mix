minikube start --image-mirror-country='cn' --docker-env no_proxy=localhost,127.0.0.1,192.168.59.0/24,192.168.39.0/24,192.168.49.0/24,10.96.0.0/12 --cpus 6 --memory 8192 --driver=docker



export HTTP_PROXY=http://127.0.0.1:8889
export HTTPS_PROXY=http://127.0.0.1:8889
export NO_PROXY=localhost,127.0.0.1,10.96.0.0/12,192.168.59.0/24,192.168.49.0/24,192.168.39.0/24

minikube start

// https://github.com/kubernetes/minikube/issues/15270
minikube start --image-mirror-country='cn' --kubernetes-version=v1.23.12 --cpus 6 --memory 8192


kubectl proxy --port=8001 --address=‘10.211.55.6’ --accept-hosts=’^.*’ &