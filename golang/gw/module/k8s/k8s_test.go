package k8s

import (
	"context"
	"github.com/stretchr/testify/assert"
	v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"log"
	"testing"
)

var (
	testCtx = context.TODO()
)

func TestGetKubernetesAllPods(t *testing.T) {
	cluster := GetKubernetes()
	// 查询 default 命名空间下的所有 pod
	pods, err := cluster.clientset.CoreV1().Pods("mix").List(testCtx, v1.ListOptions{})
	if err != nil {
		panic(err)
	}

	log.Printf("There are %d pods in cluster\n", len(pods.Items))
	for i, pod := range pods.Items {
		log.Printf("%d ---> %s/%s", i, pod.Namespace, pod.Name)
	}
}

func TestRolloutRestartDeployment(t *testing.T) {
	cluster := GetKubernetes()
	// 查询 default 命名空间下的所有 pod
	success, err := cluster.RolloutRestartDeployment(testCtx, MixNamespace, MixDeploymentGw)
	if err != nil {
		panic(err)
	}

	assert.Equal(t, true, success)
}
