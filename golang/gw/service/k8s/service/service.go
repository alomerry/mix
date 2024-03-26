package service

import (
	"gw/core/components/k8s"
)

var (
	IKubernetesService = &KubernetesService{}
)

func init() {
	IKubernetesService.Client = k8s.GetKubernetes()
}

type KubernetesService struct {
	Client *k8s.Cluster
}
