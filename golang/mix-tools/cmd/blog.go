package cmd

import (
	"context"
	"github.com/alomerry/mix/mix-tools/modules/blog"
	"github.com/spf13/cast"
	"github.com/spf13/cobra"
)

const (
	BuildSearchIndex = iota + 1
)

var (
	module string
)

var blogTools = &cobra.Command{
	Use:   "blog-tools",
	Short: "blog tools help your do something",
	Run: func(cmd *cobra.Command, args []string) {
		switch cast.ToInt(module) {
		case BuildSearchIndex:
			blog.GetClient().BuildIndex(context.Background(), "")
		}
	},
}

func init() {
	blogTools.Flags().StringVarP(&module, "module", "m", "", "sgs 模块包含三个功能，请使用 sgs -m <数字> 来选择执行的任务：\n1. 合并表格\n2. delay 月报\n3. 广州 delay")
	blogTools.MarkFlagRequired("module")
	RootCmd.AddCommand(blogTools)
}
