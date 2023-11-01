---
date: 2023-07-04
sidebar: false
navbar: false
---

# Function call

::: tip
函数参数皆是值拷贝，只是区别是拷贝目标对象还是拷贝指针，函数调用前就会为形参和返回值分配内存空间，并将实参拷贝到形参中
:::

了解 go 的函数调用底层逻辑，能更清晰的理解 defer、recover、panic 的工作方式

## Basic

- 局部标量
- 调用函数返回值
- 调用函数参数
- 函数返回地址
- 栈基
- 栈指针

:::tip
go 是一次性分配栈空间
:::

call 指令：

- 将下一条指令入栈，作为返回地址
- 跳转到被调用者函数执行

执行函数前的处理：

- 入栈调用函数栈的栈基
- 分配函数栈
- 设置被调用函数的栈基（bp）

执行函数
给返回值赋值
执行 defer 函数

执行 ret 指令前的处理：

- 恢复调用函数的栈基
- 释放被调函数的函数栈

ret 指令

- 弹出调用前入栈的返回地址
- 跳转到该返回地址

## Base Stack <Badge text="1.16" type="tip"/>

![golang-function-stack-frame](https://cdn.alomerry.com/blog/assets/img/notes/languare/golang/golang/golang-function-stack-frame.png)

### 传值/传指针

:::details 传值

```go
func swap(a, b int) {
  a, b = b, a
}

func main() {
  a, b = 1, 2
  swap(a, b)
  fmt.Println(a, b) // 1, 2
}
```

分析以上代码，`main` 方法在执行时会给局部变量 `a`、`b`，调用 `swap` 的两个参数（参数从右往左）分配栈空间并赋值如下：

|      栈帧       |           |
| :-------------: | :-------: |
|       ...       |           |
| 局部变量 a = 1  | `main BP` |
| 局部变量 b = 2  |           |
| swap 参数 b = 2 |           |
| swap 参数 a = 1 |           |
|    返回地址     | `main SP` |
|    `main BP`    |           |
|       ...       |           |

`swap` 方法中会将参数 `a`，`b` 交换：

|      栈帧       |           |
| :-------------: | :-------: |
|       ...       |           |
| 局部变量 a = 1  | `main BP` |
| 局部变量 b = 2  |           |
| swap 参数 b = 1 |           |
| swap 参数 a = 2 |           |
|    返回地址     | `main SP` |
|    `main BP`    |           |
|       ...       |           |

可以看到，`swap` 方法并没有修改调用者的变量，因此 `main` 方法中的 `a`，`b` 交换失败了。

:::

::: details 传指针

```go
func swap(a, b *int) {
  a, b = b, a
}

func main() {
  a, b = 1, 2
  swap(&a, &b)
  fmt.Println(a, b) // 1, 2
}
```

|         |         栈帧          |           |
| :-----: | :-------------------: | :-------: |
|         |          ...          |           |
| `addrA` |         a = 1         | `main BP` |
| `addrB` |         b = 2         |           |
|         | swap 参数 b = `addrB` |           |
|         | swap 参数 a = `addrA` |           |
|         |       返回地址        | `main SP` |
|         |       `main BP`       |           |
|         |          ...          |           |

可以看到，此时 `swap` 方法交换的是 `addrA` 和 `addrB` 对应的数据，此时就可以交换成功了。

:::

### Function Receiver

```go
type A struct {
}

func (A) F1(string) string {
  return ""
}

func (*A) F2(string) string {
  return ""
}

func f1(A, string) string {
  return "xxx"
}

func f2(*A, string) string {
  return "xxx"
}

func main() {
  fmt.Println(reflect.TypeOf(A.F1) == reflect.TypeOf(f1))    // true
  fmt.Println(reflect.TypeOf((*A).F2) == reflect.TypeOf(f2)) // true
}
```

### 返回值

:::: details 匿名返回值

```go
func inc(a int) int {
  var b int
  defer func() {
    a++
    b++
  }()

  a++
  b = a
  return b
}

func main() {
  var a, b int
  b = inc(a)
  fmt.Println(a, b) // 0, 1
}
```

::: details before call `inc`

|       栈帧       |           |
| :--------------: | :-------: |
|       ...        |           |
|  局部变量 a = 0  | `main BP` |
|  局部变量 b = 0  |           |
|  `inc` 返回值 0  |           |
| `inc` 参数 a = 0 |           |
|     返回地址     | `main SP` |
|    `main BP`     |           |
|  局部变量 b = 0  | `inc BP`  |

:::

进入 `inc` 方法后，会将 `a` 增加 1 并赋值给 `b`，最后将 `b` 赋值给返回值

::: details before return

|       栈帧       |           |
| :--------------: | :-------: |
|       ...        |           |
|  局部变量 a = 0  | `main BP` |
|  局部变量 b = 0  |           |
|  `inc` 返回值 1  |           |
| `inc` 参数 a = 1 |           |
|     返回地址     | `main SP` |
|    `main BP`     |           |
|  局部变量 b = 1  | `inc BP`  |

:::

在返回 `b` 之后会执行 defer 匿名函数的内容，将 `a`，`b` 都增加 1，最后返回：

::: details handle defer

|       栈帧       |           |
| :--------------: | :-------: |
|       ...        |           |
|  局部变量 a = 0  | `main BP` |
|  局部变量 b = 0  |           |
| `inc` 返回值 = 1 |           |
| `inc` 参数 a = 2 |           |
|     返回地址     | `main SP` |
|    `main BP`     |           |
|  局部变量 b = 2  | `inc BP`  |

:::

返回 `main` 方法后，将返回值赋值给局部变量 `b`：

::: details return main

|       栈帧       |           |
| :--------------: | :-------: |
|       ...        |           |
|  局部变量 a = 0  | `main BP` |
|  局部变量 b = 1  |           |
|  `inc` 返回值 1  |           |
| `inc` 参数 a = 2 |           |
|     返回地址     | `main SP` |
|    `main BP`     |           |
|       ...        |           |

:::

所以最后输出的 `a`，`b` 为 `0`，`1`。

::::

:::: details 命名返回值

```go
func inc(a int) (b int) {
  defer func() {
    a++
    b++
  }()

  a++
  b = a
  return b
}

func main() {
  var a, b int
  b = inc(a)
  fmt.Println(a, b) // 0, 2
}
```

::: details

|       栈帧       |           |
| :--------------: | :-------- |
|       ...        |           |
|  局部变量 a = 0  | `main BP` |
|  局部变量 b = 0  |           |
|  `inc` 返回值 0  |           |
| `inc` 参数 a = 0 |           |
|     返回地址     | `main SP` |
|    `main BP`     |           |

:::

::: details

|       栈帧       |           |
| :--------------: | :-------- |
|       ...        |           |
|  局部变量 a = 0  | `main BP` |
|  局部变量 b = 0  |           |
|  `inc` 返回值 1  |           |
| `inc` 参数 a = 1 |           |
|     返回地址     | `main SP` |
|    `main BP`     |           |

:::

::: details

|       栈帧       |           |
| :--------------: | :-------- |
|       ...        |           |
|  局部变量 a = 0  | `main BP` |
|  局部变量 b = 0  |           |
|  `inc` 返回值 2  |           |
| `inc` 参数 a = 2 |           |
|     返回地址     | `main SP` |
|    `main BP`     |           |

:::

::: details

|       栈帧       |           |
| :--------------: | :-------- |
|       ...        |           |
|  局部变量 a = 0  | `main BP` |
|  局部变量 b = 2  |           |
|  `inc` 返回值 2  |           |
| `inc` 参数 a = 2 |           |
|     返回地址     | `main SP` |
|    `main BP`     |           |

:::

::::

## 基于寄存器 <Badge text="1.17+" type="tip"/>

- [Proposal: Register-based Go calling convention](https://go.googlesource.com/proposal/+/master/design/40724-register-calling.md)
- https://www.kandaoni.com/news/56576.html
- https://www.kuangstudy.com/m/bbs/1624703556664086530
- https://www.cnblogs.com/luozhiyun/p/14844710.html
- https://www.kandaoni.com/news/56576.html
- https://www.bilibili.com/video/BV1WZ4y1p7JT/?spm_id_from=333.337.search-card.all.click&vd_source=ddc8289a36a2bf501f48ca984dc0b3c1
- https://www.bilibili.com/video/BV1tZ4y1p7Rv/?spm_id_from=333.788.recommend_more_video.-1&vd_source=ddc8289a36a2bf501f48ca984dc0b3c1

<!-- ## Closure

::: info [Wikipedia Closure](https://en.wikipedia.org/wiki/Closure_(computer_programming))

闭包在实现上是一个结构体，它存储了一个函数（通常是其入口地址）和一个关联的环境（相当于一个符号查找表）。环境里是若干对符号和值的对应关系，它既要包括约束变量（该函数内部绑定的符号），也要包括自由变量（在函数外部定义但在函数内被引用），有些函数也可能没有自由变量。闭包跟函数最大的不同在于，当捕捉闭包的时候，它的自由变量会在捕捉时被确定，这样即便脱离了捕捉时的上下文，它也能照常运行。

:::

```go
func create() func()int {
  c := 2
  return func() int {
    return c
  }
}

func main() {
  f1 := create()
  f2 := create()
  fmt.Println(f1(), f2())
  // 2, 2
}
```

执行 main 时会在栈上分配局部变量 `f1`、`f2` 和 `create` 返回值。执行第一个 create 时，会在 create 栈上分配局部变量 c，并在堆上分配一个指向代码段中 create 中匿名函数的 `funcValue` 变量，并将局部变量 c 复制到捕获列表中，最后将返回值赋给 f1；执行第二个 create 也是同样的。最后执行 f1、f2 输出皆为 `2`。

|         |        栈帧         |                    |
| ------: | :-----------------: | :----------------- |
|         |  局部变量 f1 = nil  | `main BP`          |
|         |  局部变量 f2 = nil  |                    |
|         |    create 返回值    |                    |
|         |      返回地址       | `main SP`          |
|         |      `main BP`      |                    |
|         |        c = 2        | ^BP^ ^of^ ^create^ |
|         |         ...         |                    |
|         |         ...         | 堆                 |
|         |        c = 2        |                    |
| ^addr3^ |     fn = addr1      |                    |
|         |         ...         |                    |
|         |        c = 2        |                    |
| ^addr2^ |     fn = addr1      |                    |
|         |         ...         | 数据段             |
|         |         ...         | 代码段             |
| ^addr1^ | create 中的匿名函数 |                    |


以上代码中由于 c 初始化后没有其他修改，所以在返回闭包函数时，会直接将变量拷贝到 funcValue 的捕获列表中，执行时通过偏移来获取变量的值，如果函数中修改了被捕获的局部变量，或者变量逃逸了则会将变量分配到堆上，并将地址存到 [funcval](https://github.com/golang/go/blob/release-branch.go1.20/src/runtime/runtime2.go#L197) 的捕获列表中

```go
func create() (fs [2]func()) {
  for i := 0; i < 2; i++ {
    fs[i] = func() {
      fmt.Println(i)
    }
  }
}

func main() {
  fs := create()
  for i:= 0; i < len(fs); i++ {
    fs[i]()
  }
  // 2, 2
}
```

|         |         栈帧         |                    |
| ------: | :------------------: | :----------------- |
|         | 局部变量 fs[0] = nil | `main BP`          |
|         | 局部变量 fs[1] = nil |                    |
|         |  create 返回值 [0]   |                    |
|         |  create 返回值 [1]   |                    |
|         |       返回地址       | `main SP`          |
|         |      `main BP`       |                    |
|         |          &i          | ^BP^ ^of^ ^create^ |
|         |         ...          |                    |
|         |         ...          | 堆                 |
|         |        i = 0         |                    |
|         |         ...          |                    |
|         |          &i          |                    |
| ^addr3^ |      fn = addr1      |                    |
|         |         ...          |                    |
|         |          &i          |                    |
| ^addr2^ |      fn = addr1      |                    |
|         |         ...          | 数据段             |
|         |         ...          | 代码段             |
| ^addr1^ | create 中的匿名函数  |                    |


如果闭包捕获了函数参数或者返回值呢？

- 编译器会将分配到栈上的参数和返回值拷贝到堆上，外层调用函数和闭包中都使用堆中的变量，在返回返回值之前，会将堆上的返回值赋值到栈上

TODO

https://www.bilibili.com/video/BV1ma4y1e7R5/?spm_id_from=333.999.0.0&vd_source=ddc8289a36a2bf501f48ca984dc0b3c1 -->

## Reference

- [函数调用栈（上）栈帧布局和函数跳转](https://www.bilibili.com/video/BV1WZ4y1p7JT)
- [函数调用栈（下）](https://www.bilibili.com/video/BV1WZ4y1p7JT)

- https://zhuanlan.zhihu.com/p/593513674
- https://draveness.me/golang/docs/part2-foundation/ch04-basic/golang-function-call
- https://cloud.tencent.com/developer/article/2126557
