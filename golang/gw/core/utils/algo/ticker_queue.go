package algo

import (
	"sync"
	"time"
)

type TickQueue[T comparable] struct {
	idx    map[T]int
	lock   sync.RWMutex
	ticker *time.Ticker
	cnt    int
	f      func(T)
}

func NewTickQueue[T comparable](duration time.Duration, f func(T)) *TickQueue[T] {
	return &TickQueue[T]{
		idx:    map[T]int{},
		lock:   sync.RWMutex{},
		ticker: time.NewTicker(duration),
		f:      f,
	}
}

func (t *TickQueue[T]) Enqueue(id T) {
	t.lock.Lock()
	defer t.lock.Unlock()
	t.cnt++
	_, exists := t.idx[id]
	if exists {
		t.idx[id]++
		return
	}
	t.idx[id] = 1
}

func (t *TickQueue[T]) Run() {
	for {
		<-t.ticker.C

		t.lock.Lock()

		if t.cnt == 0 {
			t.lock.Unlock()
			break
		}
		for k, v := range t.idx {
			if v > 0 {
				go t.f(k)
				t.idx[k] = 0
			}
		}
		t.lock.Unlock()
	}
}

