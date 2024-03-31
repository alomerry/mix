package service

import (
	"context"
	"gw/core/components/k8s"
	"gw/core/constant"
	"gw/core/log"
	proto "gw/proto/k8s"
	"time"

	v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

func (k *KubernetesService) ListResources(ctx context.Context, req *proto.ListResourcesRequest) (*proto.ListResourcesResponse, error) {
	var (
		resp, err = k.ListNamespaces(ctx, &proto.ListNamespacesRequest{Namespaces: req.Namespaces})
		res       = &proto.ListResourcesResponse{}
	)

	if err != nil {
		return nil, err
	}

	for _, resourceType := range req.ResourceTypes {
		switch resourceType {
		case constant.ResourceTypeDeployment:
			res.NamespaceDeployments = k.fetchNamespacesDeployments(ctx, resp.Namespaces)
		case constant.ResourceTypePod:
			res.NamespacePods = k.fetchNamespacesPods(ctx, resp.Namespaces)
		}
	}

	return res, nil
}

func (k *KubernetesService) fetchNamespacesDeployments(ctx context.Context, namespaces []string) []*proto.NamespaceDeployments {
	var res []*proto.NamespaceDeployments
	for _, namespace := range namespaces {
		deployments, err := k.Client.Deployment(namespace).List(ctx, v1.ListOptions{})
		if err != nil {
			log.Error(ctx, "get pods failed.", err.Error())
		}

		var namespaceDeployments = &proto.NamespaceDeployments{
			Namespace: namespace,
		}
		for _, deployment := range deployments.Items {
			namespaceDeployments.Deployments = append(namespaceDeployments.Deployments, &proto.Deployment{
				Namespace: deployment.Namespace,
				Name:      deployment.Name,
				CreatedAt: deployment.CreationTimestamp.Format(time.DateTime),
			})
		}

		if len(namespaceDeployments.Deployments) > 0 {
			res = append(res, namespaceDeployments)
		}
	}
	return res
}

func (k *KubernetesService) fetchNamespacesPods(ctx context.Context, namespaces []string) []*proto.NamespacePods {
	var res []*proto.NamespacePods
	for _, namespace := range namespaces {
		pods, err := k.Client.Pods(namespace).List(ctx, v1.ListOptions{})
		if err != nil {
			log.Error(ctx, "get pods failed.", err.Error())
		}

		var namespacePods = &proto.NamespacePods{
			Namespace: namespace,
		}
		for _, pod := range pods.Items {
			namespacePods.Pods = append(namespacePods.Pods, &proto.Pod{
				Namespace:    pod.Namespace,
				Name:         pod.Name,
				Status:       string(pod.Status.Phase),
				CreatedAt:    pod.CreationTimestamp.Format(time.DateTime),
				RestartCount: k8s.GetPodMaxContainerRestartCount(pod),
				PodIp:        pod.Status.PodIP,
			})
		}

		if len(namespacePods.Pods) > 0 {
			res = append(res, namespacePods)
		}
	}
	return res
}
