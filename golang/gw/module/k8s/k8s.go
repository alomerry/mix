package k8s

import (
	"context"
	"fmt"
	"github.com/alomerry/go-tools/static/constant"
	"github.com/alomerry/go-tools/static/env"
	v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/types"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/clientcmd"
	"time"
)

const (
	MixNamespace    = "mix"
	MixDeploymentGw = "gw-deployment"
	MixPodGw        = "gw-deployment"

	MixOptVersion = "mix-opt-version"
)

var (
	client *Cluster
)

func init() {
	var (
		config *rest.Config
		err    error
	)
	switch env.GetEnv() {
	case constant.EnvLocal:
		config, err = clientcmd.BuildConfigFromFlags("", env.GetKubeConfig())
		if err != nil {
			panic(err.Error())
		}
	default:
		config, err = rest.InClusterConfig()
		if err != nil {
			panic(err)
		}
	}

	clientset, err := kubernetes.NewForConfig(config)
	if err != nil {
		panic(err)
	}

	client = &Cluster{clientset: clientset}
}

type Cluster struct {
	clientset *kubernetes.Clientset
}

func GetKubernetes() *Cluster {
	return client
}

func (c *Cluster) RolloutRestartDeployment(ctx context.Context, namespace string, deployment string) (bool, error) {
	var (
		deploy    = c.clientset.AppsV1().Deployments(namespace)
		patchOpt  = v1.PatchOptions{FieldManager: "kubectl-rollout"}
		patchInfo = fmt.Sprintf(`{"spec":{"template":{"metadata":{"annotations":{"kubectl.kubernetes.io/restartedAt":"%s"}}}}}`, time.Now().Format(time.DateTime))
	)

	// TODO 监听状态，失败则回滚

	_, err := deploy.Patch(ctx, deployment, types.StrategicMergePatchType, []byte(patchInfo), patchOpt)
	if err != nil {
		return false, err
	}

	return true, nil
}
