package internal

import (
	"context"
	"encoding/json"
	"github.com/alomerry/go-tools/static/env"
	"github.com/elastic/go-elasticsearch/v8"
	"github.com/elastic/go-elasticsearch/v8/typedapi/core/search"
	"github.com/elastic/go-elasticsearch/v8/typedapi/types"
	"github.com/gin-gonic/gin"
	"net/http"
	"time"
)

const (
	blogIndex = "search-mix-blog"
)

var (
	client          *elasticsearch.TypedClient
	IBlogController *BlogController
)

func init() {
	IBlogController = &BlogController{}
	initEsClient()
}

func initEsClient() {
	cfg := elasticsearch.Config{
		Addresses: []string{
			env.GetElasticSearchEndpoint(),
		},
		APIKey: env.GetElasticSearchAK(),
	}
	var err error
	client, err = elasticsearch.NewTypedClient(cfg)
	if err != nil {
		panic(err)
	}
}

type BlogController struct {
}

type markdown struct {
	Path      string              `json:"markdownPath"`
	Title     string              `json:"title,omitempty"`
	Place     string              `json:"place,omitempty"`
	Desc      string              `json:"description,omitempty"`
	Types     []string            `json:"types,omitempty"`
	Highlight map[string][]string `json:"highlight,omitempty"`
	CreatedAt *time.Time          `json:"createdAt,omitempty"`
	UpdatedAt *time.Time          `json:"updatedAt,omitempty"`
}

func (k *BlogController) Register(group *gin.RouterGroup) {
	group.POST("/search", k.blogSearch)
}

func (*BlogController) blogSearch(c *gin.Context) {
	resp, err := client.Search().Index(blogIndex).Request(genBlogSearchQuery(c.Query("keyword"))).Do(context.Background())
	if err != nil {
		c.String(http.StatusBadRequest, "%v", err.Error())
		return
	}
	var result = []markdown{}
	for _, hit := range resp.Hits.Hits {
		data := markdown{}
		err = json.Unmarshal(hit.Source_, &data)
		if err == nil {
			if len(hit.Highlight) > 0 {
				data.Highlight = make(map[string][]string)
				for k, v := range hit.Highlight {
					data.Highlight[k] = append(data.Highlight[k], v...)
				}
			}
			result = append(result, data)
		}
	}
	c.JSON(http.StatusOK, result)
}

func genBlogSearchQuery(keyword string) *search.Request {
	return &search.Request{
		Query: &types.Query{
			Bool: &types.BoolQuery{
				Should: []types.Query{
					{MatchPhrase: map[string]types.MatchPhraseQuery{"title": {Query: keyword}}},
					{MatchPhrase: map[string]types.MatchPhraseQuery{"content": {Query: keyword}}},
					{MatchPhrase: map[string]types.MatchPhraseQuery{"description": {Query: keyword}}},
					{MatchPhrase: map[string]types.MatchPhraseQuery{"place": {Query: keyword}}},
				},
			},
		},
		Highlight: &types.Highlight{
			Fields: map[string]types.HighlightField{
				"title":       {},
				"content":     {},
				"description": {},
				"place":       {},
			},
		},
	}
}
