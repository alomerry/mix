---
date: 2023-01-27
description: KMP 算法 字符串匹配
tag:
  - Algorithm
  - KMP
---

# KMP（Knuth-Morris-Pratt）

## Question

如果有 s 串 `abcazdabcabc` 和 P 串 `abcab` 两个字符串，求 p 串第一次出现在 s 串的位置。

### 暴力法

以朴素或者说暴力的方式解决上面的问题，应该是使用双重循环：

```go
for i := range s {
    si := i
    for j := range p {
        if s[si] != p[j] {
            break
        }
        si++
    }
    if si - i == len(p){
        // 匹配成功 break 或 return
    }
}
```

外层循环遍历 s 串的每个字符，内层循环遍历 p 串的每个字符是否和 s 串位置依次相同，直到匹配成功或循环结束即可得到所需的位置。

不过当 s、p 串的长度变长之后，该算法的复杂度最坏会上升到 `len(s)*len(p)`，即 n^2^，那么可以减小时间复杂度吗？

## 尝试优化

想要减小时间复杂度，那就要找出该算法中，是否有无效的计算。

```diff
（轮次 1）
  0 1 2 3 4 5 6 7 8 9
+ a b c a z a b c a b c
- a b c a b
          ^
```

当计算上面的位置时，发现 s 和 p 不一致，校验失败，此时进入新的轮次：

```diff
（轮次 2）
+ a b c a z a b c a b c
-   a b c a b
    ^
（轮次 3）
+ a b c a z a b c a b c
-     a b c a b
      ^
（轮次 4）
+ a b c a z a b c a b c
-       a b c a b
        ^
（轮次 5）
+ a b c a z a b c a b c
-         a b c a b
          ^
（轮次 6）......
```

此时 p 串依次后移，从 s 串次位进行对比。

仔细观察，在已知 **轮次 1** 在 p~4~ 对比时失败，接着进行了 **轮次 2、3** 且 s 串首位都不是 p~0~ `a`。

这里就可以做优化了，原因如下：

**轮次 1** 失败后得知 s 串前四位和 p 串前四位一致，即：`a b c a`，那么如果要保证下一轮次 s 串首位是 `a`，至少要从 s 串的下一个 `a` 字符开始比较。正好我们知道：

- s~0~ = p~0~
- s~1~ = p~1~
- s~2~ = p~2~
- s~3~ = p~3~
- p~3~ 为 `a`

所以我们就找到了 s 串的下一个 `a`，直接跳过 **轮次 2、3**，进入 **轮次 4**。

## 分析

匹配失败后，获得了一个 s、p 串部分匹配的前缀，如何利用这个前缀将 p 串尽可能最大化移动到 s 串的末端是优化的关键。

如何得知最大移动位数呢，再来看 **轮次 1** 中 s、p 串相同的前缀 `abca`，这个前缀串的前缀和后缀有公共相同的子串 `a`。p~5~ 配对失败后，将 p 移动 3 位（公共串长度 - 公共串的最大公共前后缀长度）。

我们将公共串 `abca` 假设成任何其他的串，例如 `a b c a s d c a b ?`：

```diff
    0 1 2 3 4 5 6 7 8
+ ? a b c a s c a b * ?
-   a b c a s c a b ? ?
                    ^
```

如果此时匹配到 p~8~（ 第一个 `?`）不相同，此时公共前缀为 `abcascab`，那么要移动的距离就是串 p~0~~-~~8~ 的公共前后缀，即 `ab`。所以最后问题的关键就落在了如何求出 p 的子串对应的公共前后缀长度问题。

## 部分匹配表（Partial Match Table）

:::tip 概念
**前缀** 和 **后缀**：**前缀** 指除了最后一个字符以外，一个字符串的全部头部组合；**后缀** 指除了第一个字符以外，一个字符串的全部尾部组合。
:::

例如对于串 `abcdcba` 前后缀

- `a`：无；无
- `ab`：`a`；`b`
- `abc`：`a`、`ab`；`c`、`cb`
- `abcd`：`a`、`ab`、`abc`；`d`、`dc`、`dcb`
- `abcdc`：`a`、`ab`、`abc`、`abcd`；`c`、`cd`、`cdc`、`cdcb`
- `abcdcb`：`a`、`ab`、`abc`、`abcd`、`abcdc`；`b`、`bc`、`bcd`、`bcdc`、`bcdcb`
- `abcdcba`：`a`、`ab`、`abc`、`abcd`、`abcdc`、`abcdcb`；`a`、`ab`、`abc`、`abcd`、`abcdc`、`abcdcb`

这样就能计算出部分匹配表

```diff
  0 1 2 3 4 5 6
+ a b c d c b a
- 0 0 0 0 0 0 4
```

那么如何以算法的形式计算出来呢？可以使用动态规划：

获取当前位前一位的串的部分匹配值，移动到匹配值的位置，如果匹配值的位置的下一位和当前位一致，则当前位的匹配值加一，否则为 0

## Reference

- [字符串匹配的 KMP 算法（阮一峰）](https://www.ruanyifeng.com/blog/2013/05/Knuth–Morris–Pratt_algorithm.html)
- [如何更好地理解和掌握 KMP 算法？](https://www.zhihu.com/question/21923021)