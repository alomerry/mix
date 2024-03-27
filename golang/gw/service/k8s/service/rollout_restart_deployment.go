package service

import (
	"context"
	"fmt"
	"github.com/alomerry/go-tools/utils/array"
	core_codes "gw/core/codes"
	constant "gw/core/components/k8s"
	"gw/proto/k8s"
	"gw/service/k8s/codes"
	v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/types"
	"time"
)

func (k *KubernetesService) RolloutRestartDeployment(ctx context.Context, req *k8s.RolloutRestartDeploymentRequest) (*k8s.RolloutRestartDeploymentResponse, error) {
	if err := validate(req); err != nil {
		return nil, err
	}
	var (
		deploy     = k.Client.Deployment(req.Namespace)
		deployment = req.Deployment
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

func validate(req *k8s.RolloutRestartDeploymentRequest) error {
	if req.Namespace != constant.NamespaceAlomerry {
		return core_codes.NewError(codes.NamespaceNotSupport, "命名空间不支持")
	}

	if !array.Contains(constant.MixDeployments, req.Deployment) {
		return core_codes.NewError(codes.DeploymentNotSupport, "deployment 不支持")
	}
	return nil
}
