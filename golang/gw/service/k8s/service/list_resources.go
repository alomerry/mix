package service

import (
	"context"
	constant "gw/core/components/k8s"
	"gw/core/log"
	"gw/proto/k8s"
	"time"

	v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

func (k *KubernetesService) ListResources(ctx context.Context, req *k8s.ListResourcesRequest) (*k8s.ListResourcesResponse, error) {
	var (
		resp, err = k.ListNamespaces(ctx, &k8s.ListNamespacesRequest{Namespaces: req.Namespaces})
		res       = &k8s.ListResourcesResponse{}
	)

	if err != nil {
		return nil, err
	}

	for _, resourceType := range req.ResourceTypes {
		switch resourceType {
		case constant.ResourceTypeDeployment:
			// res.NamespacePods = k.fetchNamespacesPods(ctx, resp.Namespaces)
		case constant.ResourceTypePod:
			res.NamespacePods = k.fetchNamespacesPods(ctx, resp.Namespaces)
		}
	}

	return res, nil
}

func (k *KubernetesService) fetchNamespacesPods(ctx context.Context, namespaces []string) []*k8s.NamespacePods {
	var res []*k8s.NamespacePods
	for _, namespace := range namespaces {
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
			res = append(res, namespacePods)
		}
	}
	return res
}
