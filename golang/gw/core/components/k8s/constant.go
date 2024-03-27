package k8s

const (
	NamespaceAlomerry            = "alomerry"
	DeploymentAlomerryGw         = "mix-gw-deployment"
	DeploymentAlomerryAdmin      = "mix-module-admin-deployment"
	DeploymentAlomerryBlog       = "mix-module-blog-deployment"
	DeploymentAlomerryKubernetes = "mix-module-k8s-deployment"

	MixOptVersion = "mix-opt-version"
)

var (
	MixDeployments = []string{
		DeploymentAlomerryBlog, DeploymentAlomerryAdmin, DeploymentAlomerryKubernetes, DeploymentAlomerryGw,
	}
)
