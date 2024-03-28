package constant

const (
	NamespaceAlomerry = "alomerry"

	// Deployment
	DeploymentAlomerryGw         = "mix-gw-deployment"
	DeploymentAlomerryAdmin      = "mix-module-admin-deployment"
	DeploymentAlomerryBlog       = "mix-module-blog-deployment"
	DeploymentAlomerryKubernetes = "mix-module-k8s-deployment"

	MixOptVersion = "mix-opt-version"

	// 资源类型
	ResourceTypePod        = "Pod"
	ResourceTypeDeployment = "Deployment"

	// Pod 状态
	PodStatusPending = "Pending"
	PodStatusRunning = "Running"
)

var (
	MixDeployments = []string{
		DeploymentAlomerryBlog, DeploymentAlomerryAdmin, DeploymentAlomerryKubernetes, DeploymentAlomerryGw,
	}

	KubernetesResourceTypes = []string{ResourceTypeDeployment, ResourceTypePod}
)

// TODO 移到 constant
