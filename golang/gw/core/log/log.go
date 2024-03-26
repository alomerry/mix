package log

import (
	"context"
	"log/slog"
	"os"
)

var (
	log *slog.Logger
)

func init() {
	log = slog.New(slog.NewJSONHandler(os.Stdout, nil))
}

func Info(ctx context.Context, msg string) {
	log.Info(msg)
}

func Error(ctx context.Context, msg string, args ...any) {
	log.Error(msg, args...)
}
