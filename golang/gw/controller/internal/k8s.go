package internal

import (
	"context"
	"github.com/gin-gonic/gin"
	"gw/modules/k8s"
	"log/slog"
	"net/http"
)

var IKubernetesController *KubernetesController

func init() {
	IKubernetesController = &KubernetesController{}
}

type KubernetesController struct {
}

func (k *KubernetesController) Register(group *gin.RouterGroup) {
	group.POST("/restart", k.gwRestart)
	group.GET("/namespaces", k.namespaces)
}

func (*KubernetesController) gwRestart(c *gin.Context) {
	_, err := k8s.GetKubernetes().RolloutRestartDeployment(context.TODO(), k8s.MixNamespace, k8s.MixDeploymentGw)
	if err != nil {
		slog.Error("restart failed.", "err", err.Error())
		c.Error(err) // TODO
		return
	}
}

type namespaceResp struct {
	Namespaces []string `json:"namespaces"`
}

func (*KubernetesController) namespaces(c *gin.Context) {
	namespaces, err := k8s.GetKubernetes().GetAllNamespace(context.TODO())
	if err != nil {
		slog.Error("get namespace failed.", "err", err.Error())
		c.Error(err)
		return
	}
	c.JSON(http.StatusOK, namespaceResp{Namespaces: namespaces})
}
