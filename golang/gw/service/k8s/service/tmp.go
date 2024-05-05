package service

import (
	"context"
	"fmt"
	"github.com/alomerry/go-tools/utils/array"
	core_codes "gw/core/codes"
	"gw/core/constant"
	"gw/core/log"
	"gw/core/utils/algo"
	"gw/proto/k8s"
	"gw/service/k8s/codes"
	v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/types"
	v12 "k8s.io/client-go/kubernetes/typed/apps/v1"
	"time"
)

type DeployIdentifier struct {
	Namespace  string
	Deployment string
}

var (
	queue       = algo.NewTickQueue(time.Second*10, IKubernetesService.genRolloutFunction())
	deployCache = make(map[string]v12.DeploymentInterface)
)

func (k *KubernetesService) RolloutRestartDeployment(ctx context.Context, req *k8s.RolloutRestartDeploymentRequest) (*k8s.RolloutRestartDeploymentResponse, error) {
	if err := validate(req); err != nil {
		return nil, err
	}
	queue.Enqueue(DeployIdentifier{
		req.Namespace, req.Deployment,
	})

	// TODO 监听状态，失败则回滚

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

func (k *KubernetesService) genRolloutFunction() func(DeployIdentifier) {
	ctx := context.Background()
	return func(idx DeployIdentifier) {
		var (
			deploy v12.DeploymentInterface
		)

		deploy, exist := deployCache[idx.Namespace]
		if !exist {
			deploy = k.Client.Deployment(idx.Namespace)
			deployCache[idx.Namespace] = deploy
		}

		var (
			patchInfo = fmt.Sprintf(`{"spec":{"template":{"metadata":{"annotations":{"kubectl.kubernetes.io/restartedAt":"%s"}}}}}`, time.Now().Format(time.DateTime))
		)

		_, err := deploy.Patch(ctx, idx.Deployment, types.StrategicMergePatchType, []byte(patchInfo), v1.PatchOptions{FieldManager: "kubectl-rollout"})
		if err != nil {
			log.Error(ctx, "patch failed", err.Error())
		}
	}
}

