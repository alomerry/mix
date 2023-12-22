package main

import (
	"flag"
	"fmt"
	"os"
	"os/signal"
	"syscall"

	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/cache"
)

func main() {
	// 解析命令行参数，包括kubeconfig路径和Ingress命名空间
	kubeconfig := flag.String("kubeconfig", "", "Path to a kubeconfig file")
	namespace := flag.String("namespace", "default", "Namespace to watch for Ingress resources")
	flag.Parse()

	// 创建Kubernetes配置
	config, err := rest.InClusterConfig()
	if err != nil {
		if *kubeconfig == "" {
			fmt.Printf("Error creating in-cluster config: %v\n", err)
			os.Exit(1)
		}
		// 如果没有InClusterConfig可用，使用外部kubeconfig文件
		config, err = rest.InClusterConfig()
		if err != nil {
			fmt.Printf("Error creating out-of-cluster config: %v\n", err)
			os.Exit(1)
		}
	}

	// 创建Kubernetes客户端
	clientset, err := kubernetes.NewForConfig(config)
	if err != nil {
		fmt.Printf("Error creating Kubernetes client: %v\n", err)
		os.Exit(1)
	}

	// 创建Informer工厂
	factory := cache.NewSharedInformerFactoryWithOptions(
		clientset,
		0, // 0表示不使用Resync
		cache.ResourceEventHandlerFuncs{
			UpdateFunc: func(oldObj, newObj interface{}) {
				// 处理Ingress资源的更新事件
				// 在此处提取Cluster IP信息并进行相应的操作
				fmt.Printf("Ingress updated: %v\n", newObj)
			},
		},
	)

	// 创建Ingress Informer
	informer := factory.Networking().V1().Ingresses().Informer()
	stopCh := make(chan struct{})
	defer close(stopCh)

	// 启动Informer
	go factory.Start(stopCh)

	// 等待终止信号
	signalCh := make(chan os.Signal, 1)
	signal.Notify(signalCh, syscall.SIGINT, syscall.SIGTERM)
	<-signalCh
}
