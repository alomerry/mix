package cmd

import (
	"github.com/spf13/cobra"
)

var RootCmd = &cobra.Command{
	Use:   "mix-tools",
	Short: "mix tools has lots of helpful tools for mix.",
}

func Execute() {
	if err := RootCmd.Execute(); err != nil {
		panic(err)
	}
}
