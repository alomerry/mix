package service

import (
	"context"
	"gw/core/log"
	"gw/proto/k8s"
	v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"time"
)

func (k *KubernetesService) ListResources(ctx context.Context, request *k8s.ListResourcesRequest) (*k8s.ListResourcesResponse, error) {
	var (
		resp, err = k.ListNamespaces(ctx, &k8s.ListNamespacesRequest{})
		res       = &k8s.ListResourcesResponse{}
	)

	if err != nil {
		return nil, err
	}

	for _, namespace := range resp.Namespaces {
		pods, err := k.Client.Pods(namespace).List(ctx, v1.ListOptions{})
		if err != nil {
			log.Error(ctx, "get pods failed.", err.Error())
		}

		var namespacePods = &k8s.NamespacePods{
			Namespace: namespace,
		}
		for _, pod := range pods.Items {
			namespacePods.Pods = append(namespacePods.Pods, &k8s.Pod{
				Namespace: pod.Namespace,
				Name:      pod.Name,
				Status:    string(pod.Status.Phase),
				CreatedAt: pod.CreationTimestamp.Format(time.DateTime),
			})
		}

		if len(namespacePods.Pods) > 0 {
			res.NamespacePods = append(res.NamespacePods, namespacePods)
		}
	}

	return res, nil
}
