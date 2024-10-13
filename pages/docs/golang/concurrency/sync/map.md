---
date: 2023-06-20T16:00:00.000+00:00
title: sync map
duration: 3min
wordCount: 484
---

- https://imlht.com/archives/258/
- https://www.bmabk.com/index.php/post/127722.html

## Codes

^[sync.map]:

```go
// Map is like a Go map[interface{}]interface{} but is safe for concurrent use
// by multiple goroutines without additional locking or coordination.
// Loads, stores, and deletes run in amortized constant time.
//
// The Map type is specialized. Most code should use a plain Go map instead,
// with separate locking or coordination, for better type safety and to make it
// easier to maintain other invariants along with the map content.
//
// The Map type is optimized for two common use cases: (1) when the entry for a given
// key is only ever written once but read many times, as in caches that only grow,
// or (2) when multiple goroutines read, write, and overwrite entries for disjoint
// sets of keys. In these two cases, use of a Map may significantly reduce lock
// contention compared to a Go map paired with a separate Mutex or RWMutex.
//
// The zero Map is empty and ready for use. A Map must not be copied after first use.
//
// In the terminology of the Go memory model, Map arranges that a write operation
// “synchronizes before” any read operation that observes the effect of the write, where
// read and write operations are defined as follows.
// Load, LoadAndDelete, LoadOrStore are read operations;
// Delete, LoadAndDelete, and Store are write operations;
// and LoadOrStore is a write operation when it returns loaded set to false.
type Map struct {
  mu Mutex

  // read contains the portion of the map's contents that are safe for
  // concurrent access (with or without mu held).
  //
  // The read field itself is always safe to load, but must only be stored with
  // mu held.
  //
  // Entries stored in read may be updated concurrently without mu, but updating
  // a previously-expunged entry requires that the entry be copied to the dirty
  // map and unexpunged with mu held.
  read atomic.Value // readOnly

  // dirty contains the portion of the map's contents that require mu to be
  // held. To ensure that the dirty map can be promoted to the read map quickly,
  // it also includes all of the non-expunged entries in the read map.
  //
  // Expunged entries are not stored in the dirty map. An expunged entry in the
  // clean map must be unexpunged and added to the dirty map before a new value
  // can be stored to it.
  //
  // If the dirty map is nil, the next write to the map will initialize it by
  // making a shallow copy of the clean map, omitting stale entries.
  dirty map[any]*entry

  // misses counts the number of loads since the read map was last updated that
  // needed to lock mu to determine whether the key was present.
  //
  // Once enough misses have occurred to cover the cost of copying the dirty
  // map, the dirty map will be promoted to the read map (in the unamended
  // state) and the next store to the map will make a new dirty copy.
  misses int
}
```
