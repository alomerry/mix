title: gRPC 服务注册发现及负载均衡的实现方案
speaker: Alomerry
url: https://alomerry.com
js:
<!-- - https://www.echartsjs.com/asset/theme/shine.js -->
prismTheme: solarizedlight
<!-- plugins:
    - echarts
    - mermaid
    - katex -->

<slide></slide>

# gRPC 服务注册发现

<slide></slide>

# Resolver

Resolver 将客户端传入的“符合某种规则的名称”解析为IP地址列表。
假设定义了一种地址格式：aaa:///bbb-project/ccc-srv
Resolver 会将这个地址解析成多个 ip:port，代表了提供 ccc-srv 服务集群的所有机器地址。

- `cc.parsedTarget = grpcutil.ParseTarget(cc.target, cc.dopts.copts.Dialer != nil)` 根据传入的 target 选择 resolver
- 调用 getResolver，使用 parsedTarget 中的 scheme 去 clientConn 和注册过的 resolver 中查找 builder。
- `rWrapper, err := newCCResolverWrapper(cc, resolverBuilder)` 在这步使用  builder 的 build 方法构建 resolver

<slide></slide>

我们在使用 grpc 的时候，首先要做的就是调用 Dial 或 DialContext 函数来初始化一个 clientConn 对象，这两个函数都需要传入一个名为target的参数 target，，也就是 server。

首先，创建了一个 clientConn 对象，并把 target 赋给了对象中的 target：

```go
	cc := &ClientConn{
		target:            target,
		csMgr:             &connectivityStateManager{},
		conns:             make(map[*addrConn]struct{}),
		dopts:             defaultDialOptions(),
		blockingpicker:    newPickerWrapper(),
		czData:            new(channelzData),
		firstResolveEvent: grpcsync.NewEvent(),
	}
```

接下来，对这个 target 进行解析

```go
cc.parsedTarget = grpcutil.ParseTarget(cc.target)
```

```go
func ParseTarget(target string) (ret resolver.Target) {
	var ok bool
	ret.Scheme, ret.Endpoint, ok = split2(target, "://")
	if !ok {
		return resolver.Target{Endpoint: target}
	}
	ret.Authority, ret.Endpoint, ok = split2(ret.Endpoint, "/")
	if !ok {
		return resolver.Target{Endpoint: target}
	}
	return ret
}
```

```go
func (cc *ClientConn) getResolver(scheme string) resolver.Builder {
	for _, rb := range cc.dopts.resolvers {
		if scheme == rb.Scheme() {
			return rb
		}
	}
	return resolver.Get(scheme)
}
```

```go
func Get(scheme string) Builder {
	if b, ok := m[scheme]; ok {
		return b
	}
	return nil
}
```

```go
func Register(b Builder) {
	m[b.Scheme()] = b
}
```

grpc 实现了一个默认的透传解析器 passthrough

```go
func init() {
	resolver.Register(&passthroughBuilder{})
}

DialContext 函数会使用获取到的 resolver 的 builder，构建一个 resolver：

```go
	rWrapper, err := newCCResolverWrapper(cc, resolverBuilder)
	...
	cc.resolverWrapper = rWrapper
	...
```

```go
func newCCResolverWrapper(cc *ClientConn, rb resolver.Builder) (*ccResolverWrapper, error) {
	ccr := &ccResolverWrapper{
		cc:   cc,
		done: grpcsync.NewEvent(),
	}
    ...
	ccr.resolver, err = rb.Build(cc.parsedTarget, ccr, rbo)
	...
}
```

resolver 对应的 builder 是按照需要自己实现的

<slide></slide>

# fileResolver 流程

- 创建 watcher 协程，并阻塞等待操作系统信号。
  - 接收到系统信号后，会读取并解析  `/etc/containerpilot/services.json` 文件中的活跃服务端节点列表。
  - 对比 resolver 中记录的活跃节点，查找出新节点和失效节点，调用 UpdateState 进行更新。
    - ResolverWrapper 中调用  updateResolverState
      - 首次进入 updateResolverState 方法会初始化 balanceWarpper，调用 maybeApplyDefaultServiceConfig 后调用 applyServiceConfigAndBalancer。
      - 调用 updateClientConnState

<slide></slide>

# 运行过程中的更新过程

后端的实例挂了，client如何感知，并创建新的连接呢？

resetTransport 实现了连接的创建：

```go
newTr, addr, reconnect, err := ac.tryAllAddrs(addrs, connectDeadline)
		if err != nil {
			ac.mu.Lock()
			if ac.state == connectivity.Shutdown {
				ac.mu.Unlock()
				return
			}
			ac.updateConnectivityState(connectivity.TransientFailure, err)
 
			// Backoff.
			b := ac.resetBackoff
			ac.mu.Unlock()
 
			timer := time.NewTimer(backoffFor)
			select {
			case <-timer.C:
				ac.mu.Lock()
				ac.backoffIdx++
				ac.mu.Unlock()
			case <-b:
				timer.Stop()
			case <-ac.ctx.Done():
				timer.Stop()
				return
			}
			continue
		}
```

tryAllAddrs 把 resolver 解析结果中的 addr 全试一遍，知道和其中一个 addr 成功建立连接，如果失败，会等待一个退避时间然后重试，重试的时经过resetTransport 函数最开头的这段：

```go
if i > 0 {
	ac.cc.resolveNow(resolver.ResolveNowOptions{})
}
```

如果不是第一次创建连接，调用 clientConn 的 resolveNow 方法，重新获取一次解析的结果，因为创建连接失败的原因很有可能就是上一次解析的结果对应的实例已经挂了。

后端的服务因为网络故障或者升级之类的原因导致的连接断开，tryAllAddrs 函数里面调用的 createTransport 处理：

```go
onGoAway := func(r transport.GoAwayReason) {
		ac.mu.Lock()
		ac.adjustParams(r)
		once.Do(func() {
			if ac.state == connectivity.Ready {
				ac.updateConnectivityState(connectivity.Connecting, nil)
			}
		})
		ac.mu.Unlock()
		reconnect.Fire()
	}
 
onClose := func() {
		ac.mu.Lock()
		once.Do(func() {
			if ac.state == connectivity.Ready {
				ac.updateConnectivityState(connectivity.Connecting, nil)
			}
		})
		ac.mu.Unlock()
		close(onCloseCalled)
		reconnect.Fire()
	}
```

上面定义了连接 goAway 或者 close 的时候，这两个函数会作为参数传入 transport.NewClientTransport 函数，进而设置到后面通过newHTTP2Client 创建的 http2client 对象中

```go
func (t *http2Client) reader() {
	...
	for {
		...
		switch frame := frame.(type) {
		case *http2.MetaHeadersFrame:
			t.operateHeaders(frame)
		case *http2.DataFrame:
			t.handleData(frame)
		case *http2.RSTStreamFrame:
			t.handleRSTStream(frame)
		case *http2.SettingsFrame:
			t.handleSettings(frame, false)
		case *http2.PingFrame:
			t.handlePing(frame)
		case *http2.GoAwayFrame:
			t.handleGoAway(frame)
		case *http2.WindowUpdateFrame:
			t.handleWindowUpdate(frame)
		default:
			errorf("transport: http2Client.reader got unhandled frame type %v.", frame)
		}
	}
}
```

reader 方法会读取连接上的所有消息，如果是 GoAway 类型，则会调用 onGoAway，而onGoAway 函数里的 reconnect.Fire()，会触发 reconnect 这个事件，这个事件被触发后，resetTransport 函数在连接成功创建之后，会阻塞在这里：

```go
// Block until the created transport is down. And when this happens,
	// we restart from the top of the addr list.
	<-reconnect.Done()
```

函数在等这个连接 goAway 或者 close，当这两种情况发生时，程序就会接着走，进入下一次循环，就会重新获取 resolver 的结果，然后建立连接：

- 已经连接的后端发生了故障；
- 已经建立的 http2client 读到了连接 goAway；
- resetTransport 进入一次新的循环，重新获取解析结果；
- resetTransport 里通过新获取到的地址，重新建立连接


<slide></slide>

By Alomerry {.text-intro}

[:fa-github: Github](https://github.com/ksky521/nodeppt){.button.ghost}
