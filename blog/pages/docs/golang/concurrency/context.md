---
date: 2023-07-17T16:00:00.000+00:00
title: 上下文 Context
duration: 26min
wordCount: 4.3k
---

#

::: tip 本文基于 Golang 1.20
:::

一个接口四个实现六个方法

## 接口定义

```go
// A Context carries a deadline, a cancellation signal, and other values across
// API boundaries.
//
// Context's methods may be called by multiple goroutines simultaneously.
type Context interface {
  // Deadline returns the time when work done on behalf of this context
  // should be canceled. Deadline returns ok==false when no deadline is
  // set. Successive calls to Deadline return the same results.
  Deadline() (deadline time.Time, ok bool)

  // Done returns a channel that's closed when work done on behalf of this
  // context should be canceled. Done may return nil if this context can
  // never be canceled. Successive calls to Done return the same value.
  // The close of the Done channel may happen asynchronously,
  // after the cancel function returns.
  //
  // WithCancel arranges for Done to be closed when cancel is called;
  // WithDeadline arranges for Done to be closed when the deadline
  // expires; WithTimeout arranges for Done to be closed when the timeout
  // elapses.
  //
  // Done is provided for use in select statements:
  //
  //  // Stream generates values with DoSomething and sends them to out
  //  // until DoSomething returns an error or ctx.Done is closed.
  //  func Stream(ctx context.Context, out chan<- Value) error {
  //    for {
  //      v, err := DoSomething(ctx)
  //      if err != nil {
  //        return err
  //      }
  //      select {
  //      case <-ctx.Done():
  //        return ctx.Err()
  //      case out <- v:
  //      }
  //    }
  //  }
  //
  // See https://blog.golang.org/pipelines for more examples of how to use
  // a Done channel for cancellation.
  Done() <-chan struct{}

  // If Done is not yet closed, Err returns nil.
  // If Done is closed, Err returns a non-nil error explaining why:
  // Canceled if the context was canceled
  // or DeadlineExceeded if the context's deadline passed.
  // After Err returns a non-nil error, successive calls to Err return the same error.
  Err() error

  // Value returns the value associated with this context for key, or nil
  // if no value is associated with key. Successive calls to Value with
  // the same key returns the same result.
  //
  // Use context values only for request-scoped data that transits
  // processes and API boundaries, not for passing optional parameters to
  // functions.
  //
  // A key identifies a specific value in a Context. Functions that wish
  // to store values in Context typically allocate a key in a global
  // variable then use that key as the argument to context.WithValue and
  // Context.Value. A key can be any type that supports equality;
  // packages should define keys as an unexported type to avoid
  // collisions.
  //
  // Packages that define a Context key should provide type-safe accessors
  // for the values stored using that key:
  //
  //   // Package user defines a User type that's stored in Contexts.
  //   package user
  //
  //   import "context"
  //
  //   // User is the type of value stored in the Contexts.
  //   type User struct {...}
  //
  //   // key is an unexported type for keys defined in this package.
  //   // This prevents collisions with keys defined in other packages.
  //   type key int
  //
  //   // userKey is the key for user.User values in Contexts. It is
  //   // unexported; clients use user.NewContext and user.FromContext
  //   // instead of using this key directly.
  //   var userKey key
  //
  //   // NewContext returns a new Context that carries value u.
  //   func NewContext(ctx context.Context, u *User) context.Context {
  //     return context.WithValue(ctx, userKey, u)
  //   }
  //
  //   // FromContext returns the User value stored in ctx, if any.
  //   func FromContext(ctx context.Context) (*User, bool) {
  //     u, ok := ctx.Value(userKey).(*User)
  //     return u, ok
  //   }
  Value(key any) any
}
```


- emptyCtx
- cancelCtx
- timerCtx
- valueCtx

- Background
- TODO
- WithCancel
- WithDeadline
- WithTimeout
- WithValue


Context实现两种递归
Context实现两种方向的递归操作。

递归方向  目的
向下递归  当对父Context进去手动取消操作，或超时取消时候，向下递归处理对实现了canceler接口的后代进行取消操作
向上队规  当对Context查询Key信息时候，若当前Context没有当前K-V信息时候，则向父辈递归查询，一直到查询到跟节点的emptyCtx，返回nil为止

```go
// propagateCancel arranges for child to be canceled when parent is.
func propagateCancel(parent Context, child canceler) {
  done := parent.Done()
  if done == nil {
    return // parent is never canceled
  }

  select {
  case <-done:
    // parent is already canceled
    child.cancel(false, parent.Err(), Cause(parent))
    return
  default:
  }

  if p, ok := parentCancelCtx(parent); ok {
    p.mu.Lock()
    if p.err != nil {
      // parent has already been canceled
      child.cancel(false, p.err, p.cause)
    } else {
      if p.children == nil {
        p.children = make(map[canceler]struct{})
      }
      p.children[child] = struct{}{}
    }
    p.mu.Unlock()
  } else {
    goroutines.Add(1)
    go func() {
      select {
      case <-parent.Done():
        child.cancel(false, parent.Err(), Cause(parent))
      case <-child.Done():
      }
    }()
  }
}
```

## cancelCtx WithDeadline

```go
// A canceler is a context type that can be canceled directly. The
// implementations are *cancelCtx and *timerCtx.
type canceler interface {
  cancel(removeFromParent bool, err, cause error)
  Done() <-chan struct{}
}

// A cancelCtx can be canceled. When canceled, it also cancels any children
// that implement canceler.
type cancelCtx struct {
  Context

  mu       sync.Mutex            // protects following fields
  done     atomic.Value          // of chan struct{}, created lazily, closed by first cancel call
  children map[canceler]struct{} // set to nil by the first cancel call
  err      error                 // set to non-nil by the first cancel call
  cause    error                 // set to non-nil by the first cancel call
}

func (c *cancelCtx) Value(key any) any {
  if key == &cancelCtxKey {
    return c
  }
  return value(c.Context, key)
}

func (c *cancelCtx) Done() <-chan struct{} {
  d := c.done.Load()
  if d != nil {
    return d.(chan struct{})
  }
  c.mu.Lock()
  defer c.mu.Unlock()
  d = c.done.Load()
  if d == nil {
    d = make(chan struct{})
    c.done.Store(d)
  }
  return d.(chan struct{})
}

func (c *cancelCtx) Err() error {
  c.mu.Lock()
  err := c.err
  c.mu.Unlock()
  return err
}

type stringer interface {
  String() string
}

func contextName(c Context) string {
  if s, ok := c.(stringer); ok {
    return s.String()
  }
  return reflectlite.TypeOf(c).String()
}

func (c *cancelCtx) String() string {
  return contextName(c.Context) + ".WithCancel"
}

// cancel closes c.done, cancels each of c's children, and, if
// removeFromParent is true, removes c from its parent's children.
// cancel sets c.cause to cause if this is the first time c is canceled.
func (c *cancelCtx) cancel(removeFromParent bool, err, cause error) {
  if err == nil {
    panic("context: internal error: missing cancel error")
  }
  if cause == nil {
    cause = err
  }
  c.mu.Lock()
  if c.err != nil {
    c.mu.Unlock()
    return // already canceled
  }
  c.err = err
  c.cause = cause
  d, _ := c.done.Load().(chan struct{})
  if d == nil {
    c.done.Store(closedchan)
  } else {
    close(d)
  }
  for child := range c.children {
    // NOTE: acquiring the child's lock while holding parent's lock.
    child.cancel(false, err, cause)
  }
  c.children = nil
  c.mu.Unlock()

  if removeFromParent {
    removeChild(c.Context, c)
  }
}
```

## timeCtx WithTimeout

```go
// &cancelCtxKey is the key that a cancelCtx returns itself for.
var cancelCtxKey int

// parentCancelCtx returns the underlying *cancelCtx for parent.
// It does this by looking up parent.Value(&cancelCtxKey) to find
// the innermost enclosing *cancelCtx and then checking whether
// parent.Done() matches that *cancelCtx. (If not, the *cancelCtx
// has been wrapped in a custom implementation providing a
// different done channel, in which case we should not bypass it.)
func parentCancelCtx(parent Context) (*cancelCtx, bool) {
  done := parent.Done()
  if done == closedchan || done == nil {
    return nil, false
  }
  p, ok := parent.Value(&cancelCtxKey).(*cancelCtx)
  if !ok {
    return nil, false
  }
  pdone, _ := p.done.Load().(chan struct{})
  if pdone != done {
    return nil, false
  }
  return p, true
}

// removeChild removes a context from its parent.
func removeChild(parent Context, child canceler) {
  p, ok := parentCancelCtx(parent)
  if !ok {
    return
  }
  p.mu.Lock()
  if p.children != nil {
    delete(p.children, child)
  }
  p.mu.Unlock()
}
// A timerCtx carries a timer and a deadline. It embeds a cancelCtx to
// implement Done and Err. It implements cancel by stopping its timer then
// delegating to cancelCtx.cancel.
type timerCtx struct {
  *cancelCtx
  timer *time.Timer // Under cancelCtx.mu.

  deadline time.Time
}

func (c *timerCtx) Deadline() (deadline time.Time, ok bool) {
  return c.deadline, true
}

func (c *timerCtx) String() string {
  return contextName(c.cancelCtx.Context) + ".WithDeadline(" +
    c.deadline.String() + " [" +
    time.Until(c.deadline).String() + "])"
}

func (c *timerCtx) cancel(removeFromParent bool, err, cause error) {
  c.cancelCtx.cancel(false, err, cause)
  if removeFromParent {
    // Remove this timerCtx from its parent cancelCtx's children.
    removeChild(c.cancelCtx.Context, c)
  }
  c.mu.Lock()
  if c.timer != nil {
    c.timer.Stop()
    c.timer = nil
  }
  c.mu.Unlock()
}
```

```go
// WithTimeout returns WithDeadline(parent, time.Now().Add(timeout)).
//
// Canceling this context releases resources associated with it, so code should
// call cancel as soon as the operations running in this Context complete:
//
//  func slowOperationWithTimeout(ctx context.Context) (Result, error) {
//    ctx, cancel := context.WithTimeout(ctx, 100*time.Millisecond)
//    defer cancel()  // releases resources if slowOperation completes before timeout elapses
//    return slowOperation(ctx)
//  }
func WithTimeout(parent Context, timeout time.Duration) (Context, CancelFunc) {
  return WithDeadline(parent, time.Now().Add(timeout))
}
```

## withValue

```go
// WithValue returns a copy of parent in which the value associated with key is
// val.
//
// Use context Values only for request-scoped data that transits processes and
// APIs, not for passing optional parameters to functions.
//
// The provided key must be comparable and should not be of type
// string or any other built-in type to avoid collisions between
// packages using context. Users of WithValue should define their own
// types for keys. To avoid allocating when assigning to an
// interface{}, context keys often have concrete type
// struct{}. Alternatively, exported context key variables' static
// type should be a pointer or interface.
func WithValue(parent Context, key, val any) Context {
  if parent == nil {
    panic("cannot create context from nil parent")
  }
  if key == nil {
    panic("nil key")
  }
  if !reflectlite.TypeOf(key).Comparable() {
    panic("key is not comparable")
  }
  return &valueCtx{parent, key, val}
}
```


```go
// Copyright 2014 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

// Package context defines the Context type, which carries deadlines,
// cancellation signals, and other request-scoped values across API boundaries
// and between processes.
//
// Incoming requests to a server should create a Context, and outgoing
// calls to servers should accept a Context. The chain of function
// calls between them must propagate the Context, optionally replacing
// it with a derived Context created using WithCancel, WithDeadline,
// WithTimeout, or WithValue. When a Context is canceled, all
// Contexts derived from it are also canceled.
//
// The WithCancel, WithDeadline, and WithTimeout functions take a
// Context (the parent) and return a derived Context (the child) and a
// CancelFunc. Calling the CancelFunc cancels the child and its
// children, removes the parent's reference to the child, and stops
// any associated timers. Failing to call the CancelFunc leaks the
// child and its children until the parent is canceled or the timer
// fires. The go vet tool checks that CancelFuncs are used on all
// control-flow paths.
//
// The WithCancelCause function returns a CancelCauseFunc, which
// takes an error and records it as the cancellation cause. Calling
// Cause on the canceled context or any of its children retrieves
// the cause. If no cause is specified, Cause(ctx) returns the same
// value as ctx.Err().
//
// Programs that use Contexts should follow these rules to keep interfaces
// consistent across packages and enable static analysis tools to check context
// propagation:
//
// Do not store Contexts inside a struct type; instead, pass a Context
// explicitly to each function that needs it. The Context should be the first
// parameter, typically named ctx:
//
//  func DoSomething(ctx context.Context, arg Arg) error {
//    // ... use ctx ...
//  }
//
// Do not pass a nil Context, even if a function permits it. Pass context.TODO
// if you are unsure about which Context to use.
//
// Use context Values only for request-scoped data that transits processes and
// APIs, not for passing optional parameters to functions.
//
// The same Context may be passed to functions running in different goroutines;
// Contexts are safe for simultaneous use by multiple goroutines.
//
// See https://blog.golang.org/context for example code for a server that uses
// Contexts.
package context

import (
  "errors"
  "internal/reflectlite"
  "sync"
  "sync/atomic"
  "time"
)

// A Context carries a deadline, a cancellation signal, and other values across
// API boundaries.
//
// Context's methods may be called by multiple goroutines simultaneously.
type Context interface {
  // Deadline returns the time when work done on behalf of this context
  // should be canceled. Deadline returns ok==false when no deadline is
  // set. Successive calls to Deadline return the same results.
  Deadline() (deadline time.Time, ok bool)

  // Done returns a channel that's closed when work done on behalf of this
  // context should be canceled. Done may return nil if this context can
  // never be canceled. Successive calls to Done return the same value.
  // The close of the Done channel may happen asynchronously,
  // after the cancel function returns.
  //
  // WithCancel arranges for Done to be closed when cancel is called;
  // WithDeadline arranges for Done to be closed when the deadline
  // expires; WithTimeout arranges for Done to be closed when the timeout
  // elapses.
  //
  // Done is provided for use in select statements:
  //
  //  // Stream generates values with DoSomething and sends them to out
  //  // until DoSomething returns an error or ctx.Done is closed.
  //  func Stream(ctx context.Context, out chan<- Value) error {
  //    for {
  //      v, err := DoSomething(ctx)
  //      if err != nil {
  //        return err
  //      }
  //      select {
  //      case <-ctx.Done():
  //        return ctx.Err()
  //      case out <- v:
  //      }
  //    }
  //  }
  //
  // See https://blog.golang.org/pipelines for more examples of how to use
  // a Done channel for cancellation.
  Done() <-chan struct{}

  // If Done is not yet closed, Err returns nil.
  // If Done is closed, Err returns a non-nil error explaining why:
  // Canceled if the context was canceled
  // or DeadlineExceeded if the context's deadline passed.
  // After Err returns a non-nil error, successive calls to Err return the same error.
  Err() error

  // Value returns the value associated with this context for key, or nil
  // if no value is associated with key. Successive calls to Value with
  // the same key returns the same result.
  //
  // Use context values only for request-scoped data that transits
  // processes and API boundaries, not for passing optional parameters to
  // functions.
  //
  // A key identifies a specific value in a Context. Functions that wish
  // to store values in Context typically allocate a key in a global
  // variable then use that key as the argument to context.WithValue and
  // Context.Value. A key can be any type that supports equality;
  // packages should define keys as an unexported type to avoid
  // collisions.
  //
  // Packages that define a Context key should provide type-safe accessors
  // for the values stored using that key:
  //
  //   // Package user defines a User type that's stored in Contexts.
  //   package user
  //
  //   import "context"
  //
  //   // User is the type of value stored in the Contexts.
  //   type User struct {...}
  //
  //   // key is an unexported type for keys defined in this package.
  //   // This prevents collisions with keys defined in other packages.
  //   type key int
  //
  //   // userKey is the key for user.User values in Contexts. It is
  //   // unexported; clients use user.NewContext and user.FromContext
  //   // instead of using this key directly.
  //   var userKey key
  //
  //   // NewContext returns a new Context that carries value u.
  //   func NewContext(ctx context.Context, u *User) context.Context {
  //     return context.WithValue(ctx, userKey, u)
  //   }
  //
  //   // FromContext returns the User value stored in ctx, if any.
  //   func FromContext(ctx context.Context) (*User, bool) {
  //     u, ok := ctx.Value(userKey).(*User)
  //     return u, ok
  //   }
  Value(key any) any
}

// Canceled is the error returned by Context.Err when the context is canceled.
var Canceled = errors.New("context canceled")

// DeadlineExceeded is the error returned by Context.Err when the context's
// deadline passes.
var DeadlineExceeded error = deadlineExceededError{}

type deadlineExceededError struct{}

func (deadlineExceededError) Error() string   { return "context deadline exceeded" }
func (deadlineExceededError) Timeout() bool   { return true }
func (deadlineExceededError) Temporary() bool { return true }

// An emptyCtx is never canceled, has no values, and has no deadline. It is not
// struct{}, since vars of this type must have distinct addresses.
type emptyCtx int

func (*emptyCtx) Deadline() (deadline time.Time, ok bool) {
  return
}

func (*emptyCtx) Done() <-chan struct{} {
  return nil
}

func (*emptyCtx) Err() error {
  return nil
}

func (*emptyCtx) Value(key any) any {
  return nil
}

func (e *emptyCtx) String() string {
  switch e {
  case background:
    return "context.Background"
  case todo:
    return "context.TODO"
  }
  return "unknown empty Context"
}

var (
  background = new(emptyCtx)
  todo       = new(emptyCtx)
)

// Background returns a non-nil, empty Context. It is never canceled, has no
// values, and has no deadline. It is typically used by the main function,
// initialization, and tests, and as the top-level Context for incoming
// requests.
func Background() Context {
  return background
}

// TODO returns a non-nil, empty Context. Code should use context.TODO when
// it's unclear which Context to use or it is not yet available (because the
// surrounding function has not yet been extended to accept a Context
// parameter).
func TODO() Context {
  return todo
}

// A CancelFunc tells an operation to abandon its work.
// A CancelFunc does not wait for the work to stop.
// A CancelFunc may be called by multiple goroutines simultaneously.
// After the first call, subsequent calls to a CancelFunc do nothing.
type CancelFunc func()

// WithCancel returns a copy of parent with a new Done channel. The returned
// context's Done channel is closed when the returned cancel function is called
// or when the parent context's Done channel is closed, whichever happens first.
//
// Canceling this context releases resources associated with it, so code should
// call cancel as soon as the operations running in this Context complete.
func WithCancel(parent Context) (ctx Context, cancel CancelFunc) {
  c := withCancel(parent)
  return c, func() { c.cancel(true, Canceled, nil) }
}

// A CancelCauseFunc behaves like a CancelFunc but additionally sets the cancellation cause.
// This cause can be retrieved by calling Cause on the canceled Context or on
// any of its derived Contexts.
//
// If the context has already been canceled, CancelCauseFunc does not set the cause.
// For example, if childContext is derived from parentContext:
//   - if parentContext is canceled with cause1 before childContext is canceled with cause2,
//     then Cause(parentContext) == Cause(childContext) == cause1
//   - if childContext is canceled with cause2 before parentContext is canceled with cause1,
//     then Cause(parentContext) == cause1 and Cause(childContext) == cause2
type CancelCauseFunc func(cause error)

// WithCancelCause behaves like WithCancel but returns a CancelCauseFunc instead of a CancelFunc.
// Calling cancel with a non-nil error (the "cause") records that error in ctx;
// it can then be retrieved using Cause(ctx).
// Calling cancel with nil sets the cause to Canceled.
//
// Example use:
//
//  ctx, cancel := context.WithCancelCause(parent)
//  cancel(myError)
//  ctx.Err() // returns context.Canceled
//  context.Cause(ctx) // returns myError
func WithCancelCause(parent Context) (ctx Context, cancel CancelCauseFunc) {
  c := withCancel(parent)
  return c, func(cause error) { c.cancel(true, Canceled, cause) }
}

func withCancel(parent Context) *cancelCtx {
  if parent == nil {
    panic("cannot create context from nil parent")
  }
  c := newCancelCtx(parent)
  propagateCancel(parent, c)
  return c
}

// Cause returns a non-nil error explaining why c was canceled.
// The first cancellation of c or one of its parents sets the cause.
// If that cancellation happened via a call to CancelCauseFunc(err),
// then Cause returns err.
// Otherwise Cause(c) returns the same value as c.Err().
// Cause returns nil if c has not been canceled yet.
func Cause(c Context) error {
  if cc, ok := c.Value(&cancelCtxKey).(*cancelCtx); ok {
    cc.mu.Lock()
    defer cc.mu.Unlock()
    return cc.cause
  }
  return nil
}

// newCancelCtx returns an initialized cancelCtx.
func newCancelCtx(parent Context) *cancelCtx {
  return &cancelCtx{Context: parent}
}

// goroutines counts the number of goroutines ever created; for testing.
var goroutines atomic.Int32

// propagateCancel arranges for child to be canceled when parent is.
func propagateCancel(parent Context, child canceler) {
  done := parent.Done()
  if done == nil {
    return // parent is never canceled
  }

  select {
  case <-done:
    // parent is already canceled
    child.cancel(false, parent.Err(), Cause(parent))
    return
  default:
  }

  if p, ok := parentCancelCtx(parent); ok {
    p.mu.Lock()
    if p.err != nil {
      // parent has already been canceled
      child.cancel(false, p.err, p.cause)
    } else {
      if p.children == nil {
        p.children = make(map[canceler]struct{})
      }
      p.children[child] = struct{}{}
    }
    p.mu.Unlock()
  } else {
    goroutines.Add(1)
    go func() {
      select {
      case <-parent.Done():
        child.cancel(false, parent.Err(), Cause(parent))
      case <-child.Done():
      }
    }()
  }
}

// &cancelCtxKey is the key that a cancelCtx returns itself for.
var cancelCtxKey int

// parentCancelCtx returns the underlying *cancelCtx for parent.
// It does this by looking up parent.Value(&cancelCtxKey) to find
// the innermost enclosing *cancelCtx and then checking whether
// parent.Done() matches that *cancelCtx. (If not, the *cancelCtx
// has been wrapped in a custom implementation providing a
// different done channel, in which case we should not bypass it.)
func parentCancelCtx(parent Context) (*cancelCtx, bool) {
  done := parent.Done()
  if done == closedchan || done == nil {
    return nil, false
  }
  p, ok := parent.Value(&cancelCtxKey).(*cancelCtx)
  if !ok {
    return nil, false
  }
  pdone, _ := p.done.Load().(chan struct{})
  if pdone != done {
    return nil, false
  }
  return p, true
}

// removeChild removes a context from its parent.
func removeChild(parent Context, child canceler) {
  p, ok := parentCancelCtx(parent)
  if !ok {
    return
  }
  p.mu.Lock()
  if p.children != nil {
    delete(p.children, child)
  }
  p.mu.Unlock()
}

// A canceler is a context type that can be canceled directly. The
// implementations are *cancelCtx and *timerCtx.
type canceler interface {
  cancel(removeFromParent bool, err, cause error)
  Done() <-chan struct{}
}

// closedchan is a reusable closed channel.
var closedchan = make(chan struct{})

func init() {
  close(closedchan)
}

// A cancelCtx can be canceled. When canceled, it also cancels any children
// that implement canceler.
type cancelCtx struct {
  Context

  mu       sync.Mutex            // protects following fields
  done     atomic.Value          // of chan struct{}, created lazily, closed by first cancel call
  children map[canceler]struct{} // set to nil by the first cancel call
  err      error                 // set to non-nil by the first cancel call
  cause    error                 // set to non-nil by the first cancel call
}

func (c *cancelCtx) Value(key any) any {
  if key == &cancelCtxKey {
    return c
  }
  return value(c.Context, key)
}

func (c *cancelCtx) Done() <-chan struct{} {
  d := c.done.Load()
  if d != nil {
    return d.(chan struct{})
  }
  c.mu.Lock()
  defer c.mu.Unlock()
  d = c.done.Load()
  if d == nil {
    d = make(chan struct{})
    c.done.Store(d)
  }
  return d.(chan struct{})
}

func (c *cancelCtx) Err() error {
  c.mu.Lock()
  err := c.err
  c.mu.Unlock()
  return err
}

type stringer interface {
  String() string
}

func contextName(c Context) string {
  if s, ok := c.(stringer); ok {
    return s.String()
  }
  return reflectlite.TypeOf(c).String()
}

func (c *cancelCtx) String() string {
  return contextName(c.Context) + ".WithCancel"
}

// cancel closes c.done, cancels each of c's children, and, if
// removeFromParent is true, removes c from its parent's children.
// cancel sets c.cause to cause if this is the first time c is canceled.
func (c *cancelCtx) cancel(removeFromParent bool, err, cause error) {
  if err == nil {
    panic("context: internal error: missing cancel error")
  }
  if cause == nil {
    cause = err
  }
  c.mu.Lock()
  if c.err != nil {
    c.mu.Unlock()
    return // already canceled
  }
  c.err = err
  c.cause = cause
  d, _ := c.done.Load().(chan struct{})
  if d == nil {
    c.done.Store(closedchan)
  } else {
    close(d)
  }
  for child := range c.children {
    // NOTE: acquiring the child's lock while holding parent's lock.
    child.cancel(false, err, cause)
  }
  c.children = nil
  c.mu.Unlock()

  if removeFromParent {
    removeChild(c.Context, c)
  }
}

// WithDeadline returns a copy of the parent context with the deadline adjusted
// to be no later than d. If the parent's deadline is already earlier than d,
// WithDeadline(parent, d) is semantically equivalent to parent. The returned
// context's Done channel is closed when the deadline expires, when the returned
// cancel function is called, or when the parent context's Done channel is
// closed, whichever happens first.
//
// Canceling this context releases resources associated with it, so code should
// call cancel as soon as the operations running in this Context complete.
func WithDeadline(parent Context, d time.Time) (Context, CancelFunc) {
  if parent == nil {
    panic("cannot create context from nil parent")
  }
  if cur, ok := parent.Deadline(); ok && cur.Before(d) {
    // The current deadline is already sooner than the new one.
    return WithCancel(parent)
  }
  c := &timerCtx{
    cancelCtx: newCancelCtx(parent),
    deadline:  d,
  }
  propagateCancel(parent, c)
  dur := time.Until(d)
  if dur <= 0 {
    c.cancel(true, DeadlineExceeded, nil) // deadline has already passed
    return c, func() { c.cancel(false, Canceled, nil) }
  }
  c.mu.Lock()
  defer c.mu.Unlock()
  if c.err == nil {
    c.timer = time.AfterFunc(dur, func() {
      c.cancel(true, DeadlineExceeded, nil)
    })
  }
  return c, func() { c.cancel(true, Canceled, nil) }
}

// A timerCtx carries a timer and a deadline. It embeds a cancelCtx to
// implement Done and Err. It implements cancel by stopping its timer then
// delegating to cancelCtx.cancel.
type timerCtx struct {
  *cancelCtx
  timer *time.Timer // Under cancelCtx.mu.

  deadline time.Time
}

func (c *timerCtx) Deadline() (deadline time.Time, ok bool) {
  return c.deadline, true
}

func (c *timerCtx) String() string {
  return contextName(c.cancelCtx.Context) + ".WithDeadline(" +
    c.deadline.String() + " [" +
    time.Until(c.deadline).String() + "])"
}

func (c *timerCtx) cancel(removeFromParent bool, err, cause error) {
  c.cancelCtx.cancel(false, err, cause)
  if removeFromParent {
    // Remove this timerCtx from its parent cancelCtx's children.
    removeChild(c.cancelCtx.Context, c)
  }
  c.mu.Lock()
  if c.timer != nil {
    c.timer.Stop()
    c.timer = nil
  }
  c.mu.Unlock()
}

// WithTimeout returns WithDeadline(parent, time.Now().Add(timeout)).
//
// Canceling this context releases resources associated with it, so code should
// call cancel as soon as the operations running in this Context complete:
//
//  func slowOperationWithTimeout(ctx context.Context) (Result, error) {
//    ctx, cancel := context.WithTimeout(ctx, 100*time.Millisecond)
//    defer cancel()  // releases resources if slowOperation completes before timeout elapses
//    return slowOperation(ctx)
//  }
func WithTimeout(parent Context, timeout time.Duration) (Context, CancelFunc) {
  return WithDeadline(parent, time.Now().Add(timeout))
}

// WithValue returns a copy of parent in which the value associated with key is
// val.
//
// Use context Values only for request-scoped data that transits processes and
// APIs, not for passing optional parameters to functions.
//
// The provided key must be comparable and should not be of type
// string or any other built-in type to avoid collisions between
// packages using context. Users of WithValue should define their own
// types for keys. To avoid allocating when assigning to an
// interface{}, context keys often have concrete type
// struct{}. Alternatively, exported context key variables' static
// type should be a pointer or interface.
func WithValue(parent Context, key, val any) Context {
  if parent == nil {
    panic("cannot create context from nil parent")
  }
  if key == nil {
    panic("nil key")
  }
  if !reflectlite.TypeOf(key).Comparable() {
    panic("key is not comparable")
  }
  return &valueCtx{parent, key, val}
}

// A valueCtx carries a key-value pair. It implements Value for that key and
// delegates all other calls to the embedded Context.
type valueCtx struct {
  Context
  key, val any
}

// stringify tries a bit to stringify v, without using fmt, since we don't
// want context depending on the unicode tables. This is only used by
// *valueCtx.String().
func stringify(v any) string {
  switch s := v.(type) {
  case stringer:
    return s.String()
  case string:
    return s
  }
  return "<not Stringer>"
}

func (c *valueCtx) String() string {
  return contextName(c.Context) + ".WithValue(type " +
    reflectlite.TypeOf(c.key).String() +
    ", val " + stringify(c.val) + ")"
}

func (c *valueCtx) Value(key any) any {
  if c.key == key {
    return c.val
  }
  return value(c.Context, key)
}

func value(c Context, key any) any {
  for {
    switch ctx := c.(type) {
    case *valueCtx:
      if key == ctx.key {
        return ctx.val
      }
      c = ctx.Context
    case *cancelCtx:
      if key == &cancelCtxKey {
        return c
      }
      c = ctx.Context
    case *timerCtx:
      if key == &cancelCtxKey {
        return ctx.cancelCtx
      }
      c = ctx.Context
    case *emptyCtx:
      return nil
    default:
      return c.Value(key)
    }
  }
}
```