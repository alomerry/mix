package es

import (
	"github.com/alomerry/go-tools/static/env"
	"github.com/elastic/go-elasticsearch/v8"
)

var (
	client *Client
)

func init() {
	initEsClient()
}

func initEsClient() {
	cfg := elasticsearch.Config{
		Addresses: []string{
			env.GetElasticSearchEndpoint(),
		},
		APIKey: env.GetElasticSearchAK(),
	}
	tc, err := elasticsearch.NewTypedClient(cfg)
	if err != nil {
		panic(err)
	}
	client = &Client{es: tc}
}

type Client struct {
	es *elasticsearch.TypedClient
}

func GetClient() *Client {
	return client
}

func (c *Client) GetEs() *elasticsearch.TypedClient {
	return c.es
}
