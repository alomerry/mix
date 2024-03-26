package service

import (
	"context"
	"encoding/json"
	"github.com/elastic/go-elasticsearch/v8/typedapi/core/search"
	"github.com/elastic/go-elasticsearch/v8/typedapi/types"
	"gw/core/components/es"
	"gw/proto/blog"
	"time"
)

func (b BlogService) SearchBlogs(ctx context.Context, request *blog.SearchBlogsRequest) (*blog.SearchBlogsResponse, error) {
	resp, err := es.GetClient().GetEs().Search().Index(es.IndexSearchMixBlog).Request(genBlogSearchQuery(request.GetKeyword())).Do(context.Background())
	if err != nil {
		return nil, err
	}
	var result []*blog.Markdown
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
			result = append(result, &blog.Markdown{
				MarkdownPath: data.Path,
				Title:        data.Title,
				Place:        data.Place,
				Description:  data.Desc,
				Types:        data.Types,
				Highlight:    convertMap2HighlightResp(data.Highlight),
				CreatedAt:    data.CreatedAt.Format(time.DateTime),
				UpdatedAt:    data.UpdatedAt.Format(time.DateTime),
			})
		}
	}
	return &blog.SearchBlogsResponse{Markdowns: result}, nil
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

func convertMap2HighlightResp(highlight map[string][]string) map[string]*blog.Highlight {
	var res = make(map[string]*blog.Highlight)
	for highlightType, highlightContent := range highlight {
		res[highlightType] = &blog.Highlight{Content: highlightContent}
	}
	return res
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
