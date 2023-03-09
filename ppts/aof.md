## Go release 1.20

- [arena]((https://pkg.go.dev/github.com/google/gapid@v1.6.1/core/memory/arena))
- pgo（Profile-guided optimization）

## AOF 日志（Append Only File）

AOF 需要修改 redis.conf 配置文件：`appendonly yes`

```text
*3
$3
SET
$63
6278bbad702f413c245257c3_marketo_processing_workflow_acccountId
$1
1
```

### 写回策略

- always
- everysec
- no

### 重写机制

- bgrewriteaof
- COW（Copy On Write）
- AOF 重写缓冲区

## Reference

- [arena 使用](https://mp.weixin.qq.com/s/mwWMOwLsiY8EtODpyEoTIg)
- [Profile-guided optimization](https://go.dev/doc/pgo)
- [Why Compiler Function Inlining Matters](https://www.polarsignals.com/blog/posts/2021/12/15/why-compiler-function-inlining-matters/)
- [Exploring Go's Profile-Guided Optimizations](https://www.polarsignals.com/blog/posts/2022/09/exploring-go-profile-guided-optimizations/)
- [binary-trees benchmark](https://gist.github.com/DeedleFake/b0f23672cc38dfe3b1e8b8e923b3ad6c)
- [AOF 持久化是如何实现的](https://xiaolincoding.com/redis/storage/aof.html)