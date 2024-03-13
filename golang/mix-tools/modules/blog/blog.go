package blog

import (
	"context"
	"fmt"
	"github.com/alomerry/mix/mix-tools/modules/blog/markdown"
	"github.com/alomerry/mix/mix-tools/utils"
	"github.com/elastic/go-elasticsearch/v8"
	"github.com/panjf2000/ants/v2"
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
	client *Client
	wg     *sync.WaitGroup
	pool   *ants.Pool

	ignoreDirKeywords = []string{"node_modules", ".pnpm", "[...404].md"}
)

func init() {
	cfg := elasticsearch.Config{
		Addresses: []string{
			utils.GetElasticSearchEndpoint(),
		},
		APIKey: utils.GetElasticSearchAK(),
	}
	tc, err := elasticsearch.NewTypedClient(cfg)
	if err != nil {
		panic(err)
	}
	client = &Client{es: tc}

	pool, err = ants.NewPool(parallelism, ants.WithPanicHandler(func(i any) {
		fmt.Println("update index failed, err: ", i)
	}))
	if err != nil {
		panic(err)
	}

	wg = &sync.WaitGroup{}
}

type Client struct {
	es *elasticsearch.TypedClient
}

func GetClient() *Client {
	return client
}

func (c *Client) BuildIndex(ctx context.Context, blogPath string) {
	c.upsertMarkdowns(ctx, resolveMarkdowns(getDirMarkdown(blogPath)))
}

func (c *Client) upsertMarkdowns(ctx context.Context, mds []*markdown.Markdown) {
	for i := range mds {
		wg.Add(1)
		md := mds[i]
		pool.Submit(func() {
			c.upsertMarkdown(ctx, md)
		})
	}
	wg.Wait()
}

func (c *Client) upsertMarkdown(ctx context.Context, md *markdown.Markdown) {
	defer wg.Done()
	_, err := c.es.Index(blogIndex).Id(md.Id()).Request(md.Output()).Do(ctx)
	if err != nil {
		panic(err)
	}
	fmt.Printf("update [%v] success!\n", md.Path())
}

func resolveMarkdowns(markdowns []string) []*markdown.Markdown {
	var mds []*markdown.Markdown
	for _, path := range markdowns {
		md := markdown.GetParser().Parser(path)
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
		if utils.ContainsByJudge(ignoreDirKeywords, entry.Name(), strings.Contains) {
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
