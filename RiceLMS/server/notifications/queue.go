package notifications

import (
	"errors"
	"server/constants"
	"sync"
)

type Deque struct {
	items []constants.Machine
	mu    sync.Mutex
}

func NewDeque() *Deque {
	return &Deque{
		items: []constants.Machine{},
	}
}

func (d *Deque) Append(item constants.Machine) {
	d.mu.Lock()
	defer d.mu.Unlock()
	d.items = append(d.items, item)
}

func (d *Deque) Popleft() (constants.Machine, error) {
	d.mu.Lock()
	defer d.mu.Unlock()
	if len(d.items) == 0 {
		return constants.Machine{}, errors.New("deque is empty")
	}
	item := d.items[0]
	d.items = d.items[1:]
	return item, nil
}
