package service

import (
	"context"
	"encoding/json"
	"github.com/alomerry/copier"
	"github.com/elastic/go-elasticsearch/v8/typedapi/core/search"
	"github.com/elastic/go-elasticsearch/v8/typedapi/types"
	"gw/core/components/es"
	"gw/proto/blog"
	"gw/service/blog/constant"
	"time"
)

func (b BlogService) SearchBlogs(ctx context.Context, request *blog.SearchBlogsRequest) (*blog.SearchBlogsResponse, error) {
	resp, err := es.GetClient().GetEs().Search().Index(es.IndexSearchMixBlog).Request(genBlogSearchQuery(request.GetKeyword())).Do(context.Background())
	if err != nil {
		return nil, err
	}
	var (
		result []*blog.Markdown
		cp     = copier.Instance(nil)
	)
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

			md := blog.Markdown{}
			_ = cp.RegisterResetDiffField([]copier.DiffFieldPair{
				{"Path", []string{"MarkdownPath"}},
				{"Desc", []string{"Description"}},
			}).RegisterTransformer(copier.Transformer{
				"Highlight": convertMap2HighlightResp,
				"CreatedAt": transferTime,
				"UpdatedAt": transferTime,
			}).From(data).CopyTo(&md)

			result = append(result, &md)
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

func transferTime(t *time.Time) string {
	if t == nil {
		return ""
	}
	return t.Format(time.DateTime)
}

func convertMap2HighlightResp(highlight map[string][]string) *blog.Highlight {
	var res = &blog.Highlight{}
	for highlightType, highlights := range highlight {
		switch highlightType {
		case constant.BlogSearchHighLightTypeContent:
			res.Content = highlights
		case constant.BlogSearchHighLightTypeTitle:
			res.Title = highlights
		}
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
