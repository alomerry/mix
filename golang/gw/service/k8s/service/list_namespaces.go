package service

import (
	"context"
	"gw/proto/k8s"
	"strings"

	v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

func (k *KubernetesService) ListNamespaces(ctx context.Context, req *k8s.ListNamespacesRequest) (*k8s.ListNamespacesResponse, error) {
	var (
		res             []string
		namespaces, err = k.Client.Namespaces().List(ctx, v1.ListOptions{})
	)
	if err != nil {
		return nil, err
	}

	for _, n := range namespaces.Items {
		if len(req.Keyword) == 0 {
			res = append(res, n.Name)
		} else if strings.Contains(n.Name, req.Keyword) {
			res = append(res, n.Name)
		}
	}
	return &k8s.ListNamespacesResponse{Namespaces: res}, nil
}
