package k8s

import (
	"github.com/alomerry/go-tools/static/constant"
	"github.com/alomerry/go-tools/static/env"
	"k8s.io/client-go/kubernetes"
	v12 "k8s.io/client-go/kubernetes/typed/apps/v1"
	v1 "k8s.io/client-go/kubernetes/typed/core/v1"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/clientcmd"
)

var (
	client *Cluster
)

func init() {
	initClient()
}

func initClient() {
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

//
//func todo() {
//	var kubeconfig *string
//	if home := homedir.HomeDir(); home != "" {
//		kubeconfig = flag.String("kubeconfig", filepath.Join(home, ".kube", "config"), "(optional) absolute path to the kubeconfig file")
//	} else {
//		kubeconfig = flag.String("kubeconfig", "", "absolute path to the kubeconfig file")
//	}
//	flag.Parse()
//
//	// use the current context in kubeconfig
//	config, err := clientcmd.BuildConfigFromFlags("", *kubeconfig)
//	if err != nil {
//		panic(err.Error())
//	}
//
//	// create the clientset
//	clientset, err := kubernetes.NewForConfig(config)
//	if err != nil {
//		panic(err.Error())
//	}
//	for {
//		pods, err := clientset.CoreV1().Pods("").List(context.TODO(), metav1.ListOptions{})
//		if err != nil {
//			panic(err.Error())
//		}
//		fmt.Printf("There are %d pods in the cluster\n", len(pods.Items))
//
//		// Examples for error handling:
//		// - Use helper functions like e.g. errors.IsNotFound()
//		// - And/or cast to StatusError and use its properties like e.g. ErrStatus.Message
//		namespace := "default"
//		pod := "example-xxxxx"
//		_, err = clientset.CoreV1().Pods(namespace).Get(context.TODO(), pod, metav1.GetOptions{})
//		if errors.IsNotFound(err) {
//			fmt.Printf("Pod %s in namespace %s not found\n", pod, namespace)
//		} else if statusError, isStatus := err.(*errors.StatusError); isStatus {
//			fmt.Printf("Error getting pod %s in namespace %s: %v\n",
//				pod, namespace, statusError.ErrStatus.Message)
//		} else if err != nil {
//			panic(err.Error())
//		} else {
//			fmt.Printf("Found pod %s in namespace %s\n", pod, namespace)
//		}
//		time.Sleep(10 * time.Second)
//	}
//}

type Cluster struct {
	clientset *kubernetes.Clientset
}

func GetKubernetes() *Cluster {
	return client
}

func (c *Cluster) GetClientSet() *kubernetes.Clientset {
	return c.clientset
}

func (c *Cluster) CoreV1() v1.CoreV1Interface {
	return c.clientset.CoreV1()
}

func (c *Cluster) Namespaces() v1.NamespaceInterface {
	return c.clientset.CoreV1().Namespaces()
}

func (c *Cluster) Pods(namespace string) v1.PodInterface {
	return c.clientset.CoreV1().Pods(namespace)
}

func (c *Cluster) Deployment(namespace string) v12.DeploymentInterface {
	return c.clientset.AppsV1().Deployments(namespace)
}
