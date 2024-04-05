package main

import (
	"context"
	"github.com/spf13/cobra"
	"gw/service/blog/jobs"
)

const (
	buildIndex = "build-index"
)

var (
	action string
	env    string

	blog = &cobra.Command{
		Use:   "blog-tools",
		Short: "blog tools help your build elasticsearch index",
		Run: func(cmd *cobra.Command, args []string) {
			switch action {
			case buildIndex:
				jobs.BuildIndex(context.Background(), "/home/runner/work/mix/mix/blog")
			}
		},
	}
)

func init() {
	blog.Flags().StringVarP(&action, "action", "a", "", "")
	blog.Flags().StringVarP(&env, "env", "e", "", "")
	blog.MarkFlagRequired("action")
}

func main() {
	if err := blog.Execute(); err != nil {
		panic(err)
	}
}
