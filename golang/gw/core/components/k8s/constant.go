package k8s

const (
	NamespaceAlomerry            = "alomerry"
	DeploymentAlomerryGw         = "mix-gw-deployment"
	DeploymentAlomerryAdmin      = "mix-module-admin-deployment"
	DeploymentAlomerryBlog       = "mix-module-blog-deployment"
	DeploymentAlomerryKubernetes = "mix-module-k8s-deployment"

	MixOptVersion = "mix-opt-version"

	ResourceTypePod        = "Pod"
	ResourceTypeDeployment = "Deployment"
)

var (
	MixDeployments = []string{
		DeploymentAlomerryBlog, DeploymentAlomerryAdmin, DeploymentAlomerryKubernetes, DeploymentAlomerryGw,
	}

	KubernetesResourceTypes = []string{ResourceTypeDeployment, ResourceTypePod}
)

// TODO 移到 constant
