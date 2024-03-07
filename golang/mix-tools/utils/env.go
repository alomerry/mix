package utils

import "os"

func GetElasticSearchEndpoint() string {
	return os.Getenv("ELASTICSEARCH_ENDPOINT")
}

func GetElasticSearchAK() string {
	return os.Getenv("ELASTICSEARCH_PASSWORD")
}
