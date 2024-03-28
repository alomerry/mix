package k8s

import (
	v1 "k8s.io/api/core/v1"
)

func GetPodMaxContainerRestartCount(pod v1.Pod) int32 {
	var maxRestart int32
	for _, containerStatus := range pod.Status.ContainerStatuses {
		maxRestart = max(containerStatus.RestartCount, maxRestart)
	}
	return maxRestart
}
