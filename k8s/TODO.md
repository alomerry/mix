mac 远程操作集群

https://www.cnblogs.com/wubolive/p/11225486.html

https://kubernetes.io/zh-cn/docs/tasks/tools/install-kubectl-macos/


## ingress nginx 使用非 80 端口

https://docs.nginx.com/nginx-ingress-controller/tutorials/custom-listen-ports/


kubectl describe pod -n nocturnal-chorus-player player-music-deployment-c97f89577-fgfqx

kubectl get pods -A

kubectl get pods -n nocturnal-chorus-player player-music-deployment-c97f89577-fgfqx

kubectl logs -n nocturnal-chorus-player player-openapi-consumer-deployment-6994f5c8d5-cdqjn

kubectl exec -it -n nocturnal-chorus-player player-openapi-consumer-deployment-6994f5c8d5-cdqjn bash

kubectl delete pod -n nocturnal-chorus-player player-music-deployment-7fd758688f-mfr28

kubectl exec -n ingress-nginx -it ingress-nginx-controller-695bfc488d-pk655 bash

- refence 
- https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/configmap/
- https://docs.nginx.com/nginx-ingress-controller/tutorials/custom-listen-ports/

## api

https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md#metadata

## todo 

- rustdesk https://github.com/rustdesk/rustdesk/releases