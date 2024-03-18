package utils

import (
	"fmt"
	"time"
)

const (
	// Deprecated
	RFC3339utc0 = "2006-01-02T15:04:05.999+00:00"
	// Deprecated
	RFC3339utc8 = "2006-01-02T15:04:05.999+08:00"
	// Deprecated
	RFC3339mini = "2006-01-02T15:04:05.999Z"
)

var (
	// Deprecated
	EmptyTime = time.Unix(0, 0)
)

// Deprecated
func ConvString2Time(dateString string) time.Time {
	res, err := time.Parse(RFC3339utc0, dateString)
	if err == nil {
		return res
	}
	res, err = time.Parse(RFC3339utc8, dateString)
	if err == nil {
		return res
	}
	res, err = time.Parse(RFC3339mini, dateString)
	if err == nil {
		return res
	}

	res, err = time.Parse(time.DateOnly, dateString)
	if err == nil {
		return res
	}

	if dateString == "now" {
		return time.Now()
	}

	fmt.Println(err)

	return EmptyTime
}
