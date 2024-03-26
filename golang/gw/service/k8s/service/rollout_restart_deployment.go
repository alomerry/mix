package service

import (
	"context"
	"fmt"
	constant "gw/core/components/k8s"
	"gw/proto/k8s"
	v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/types"
	"time"
)

func (k *KubernetesService) RolloutRestartDeployment(ctx context.Context, request *k8s.RolloutRestartDeploymentRequest) (*k8s.RolloutRestartDeploymentResponse, error) {
	var (
		deploy     = k.Client.Deployment(constant.NamespaceMix)
		deployment = constant.DeploymentMixGw
		patchOpt   = v1.PatchOptions{FieldManager: "kubectl-rollout"}
		patchInfo  = fmt.Sprintf(`{"spec":{"template":{"metadata":{"annotations":{"kubectl.kubernetes.io/restartedAt":"%s"}}}}}`, time.Now().Format(time.DateTime))
	)

	// TODO 监听状态，失败则回滚

	_, err := deploy.Patch(ctx, deployment, types.StrategicMergePatchType, []byte(patchInfo), patchOpt)
	if err != nil {
		return nil, err
	}
	return &k8s.RolloutRestartDeploymentResponse{}, nil
}
