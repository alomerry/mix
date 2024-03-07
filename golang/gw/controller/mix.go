package controller

import (
	"context"
	"github.com/elastic/go-elasticsearch/v8"
	"github.com/elastic/go-elasticsearch/v8/typedapi/core/search"
	"github.com/elastic/go-elasticsearch/v8/typedapi/types"
	"github.com/gin-gonic/gin"
	"github.com/goccy/go-json"
	utils "gw/core"
	"net/http"
	"time"
)

const (
	blogIndex = "search-mix-blog"
)

var (
	client *elasticsearch.TypedClient
)

func init() {
	registerRouter(Version0, func(v0 *gin.RouterGroup) {
		var (
			mix  = v0.Group("/mix")
			blog = mix.Group("/blog")
		)

		blog.POST("/search", blogSearch)
	})

	cfg := elasticsearch.Config{
		Addresses: []string{
			utils.GetElasticSearchEndpoint(),
		},
		APIKey: utils.GetElasticSearchAK(),
	}
	var err error
	client, err = elasticsearch.NewTypedClient(cfg)
	if err != nil {
		panic(err)
	}
}

type markdown struct {
	Path      string     `json:"markdownPath"`
	Content   string     `json:"content,omitempty"`
	Title     string     `json:"title,omitempty"`
	Place     string     `json:"place,omitempty"`
	Desc      string     `json:"description,omitempty"`
	Types     []string   `json:"types,omitempty"`
	CreatedAt *time.Time `json:"createdAt,omitempty"`
	UpdatedAt *time.Time `json:"updatedAt,omitempty"`
}

func blogSearch(c *gin.Context) {
	keyword := c.Query("keyword")
	resp, err := client.Search().Index(blogIndex).Request(&search.Request{
		Query: &types.Query{
			MultiMatch: &types.MultiMatchQuery{
				Fields: []string{"title", "content", "description", "place"},
				Query:  keyword,
			},
		},
	}).Do(context.Background())
	if err != nil {
		c.String(http.StatusBadRequest, "%v", err.Error())
		return
	}
	var result []markdown
	for _, hit := range resp.Hits.Hits {
		data := markdown{}
		err = json.Unmarshal(hit.Source_, &data)
		if err == nil {
			result = append(result, data)
		}
	}
	c.String(http.StatusOK, "%v", result)
}
