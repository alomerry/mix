package jobs

import (
	"context"
	"fmt"
	"github.com/alomerry/go-tools/utils/array"
	"github.com/panjf2000/ants/v2"
	"gw/core/components/es"
	"gw/service/blog/model"
	"os"
	"path/filepath"
	"strings"
	"sync"
)

const (
	blogIndex   = "search-mix-blog"
	parallelism = 20
)

var (
	wg   *sync.WaitGroup
	pool *ants.Pool

	ignoreDirKeywords = []string{"node_modules", ".pnpm", "[...404].md"}
)

func init() {
	var err error
	pool, err = ants.NewPool(parallelism, ants.WithPanicHandler(func(i any) {
		fmt.Println("update index failed, err: ", i)
	}))
	if err != nil {
		panic(err)
	}

	wg = &sync.WaitGroup{}
}

func BuildIndex(ctx context.Context, blogPath string) {
	upsertMarkdowns(ctx, resolveMarkdowns(getDirMarkdown(blogPath)))
}

func upsertMarkdowns(ctx context.Context, mds []*model.Markdown) {
	for i := range mds {
		wg.Add(1)
		md := mds[i]
		pool.Submit(func() {
			upsertMarkdown(ctx, md)
		})
	}
	wg.Wait()
}

func upsertMarkdown(ctx context.Context, md *model.Markdown) {
	defer wg.Done()
	_, err := es.GetClient().GetEs().Index(blogIndex).Id(md.Id()).Request(md.Output()).Do(ctx)
	if err != nil {
		panic(err)
	}
	fmt.Printf("update [%v] success!\n", md.Path())
}

func resolveMarkdowns(markdowns []string) []*model.Markdown {
	var mds []*model.Markdown
	for _, path := range markdowns {
		md := model.GetParser().Parser(path)
		if md != nil {
			mds = append(mds, md)
		}
	}
	return mds
}

func getDirMarkdown(path string) []string {
	dir, err := os.ReadDir(path)
	if err != nil {
		panic(err)
	}
	var res []string
	for _, entry := range dir {
		if array.ContainsByJudge(ignoreDirKeywords, entry.Name(), strings.Contains) {
			continue
		}

		if !entry.IsDir() {
			if strings.HasSuffix(entry.Name(), ".md") {
				res = append(res, filepath.Join(path, entry.Name()))
			}
			continue
		}

		nextDir := filepath.Join(path, entry.Name())
		res = append(res, getDirMarkdown(nextDir)...)
	}
	return res
}
