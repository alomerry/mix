---
theme: academic
layout: cover
transition: slide-left
---

<style>
.slidev-vclick-hidden {
  display: none;
}
.col-left {
  padding-right: 10px;
}
.col-right {
  padding-right: 10px;
}
</style>

# 达夫设备与 Go 语言零值

## Alomerry Wu

---
theme: default
layout: two-cols
---

# 达夫设备(Duff's device)

<div v-click-hide="5">

<div v-click="1">

是串行复制的一种优化。最近发现 Go 语言在零值初始化的时候也利用了达夫设备的思想。于是便仔细研究了一下，今天分享给大家。

如果需要从某个地址开始，将一定长度的数据复制到另一个地址，最简单的代码是：

</div>

  <div v-click="2">

```cpp
send(short *to, short *from, int count)
{
    do {
        *to++ = *from++;
      } while (--count > 0)
}
```

</div>

<div v-click="3">

因为在每次循环中只复制了一个字节，所以需要执行 count 次条件分支判断。如果没有编译器的优化，这段代码的执行效率会比较低。

</div>

</div>

<div v-click-hide="8">

<div v-click="5">

但上面的代码只能复制长度为 8 的倍数的数据。为了能支持任意长度，我们需要处理长度不足 8 字节的情况。于是代码可以改写为：

```cpp
send(short *to, short *from, int count)
{
  int n = count % 8;
  while (n-- > 0) {
      *to++ = *from++;
  }
  n = count / 8;
  if (n == 0) return;
  do {
    *to++ = *from++;
    *to++ = *from++;
    *to++ = *from++;
    *to++ = *from++;
    *to++ = *from++;
    *to++ = *from++;
    *to++ = *from++;
    *to++ = *from++;
  } while (--n > 0);
}
```

</div>

</div>

<div v-click="8">

最后，达夫发现 http://www.lysator.liu.se/c/duffs-device.html可以把 switch 和下面的 while 语句结合起来，这样就能进一步减少编译后的机器指令。于是就有了达夫设备：

```cpp
send(short *to, short *from, int count)
{
  int n = (count + 7) / 8;
  switch (count % 8) { do {
    case 0: *to++ = *from++;
    case 7: *to++ = *from++;
    case 6: *to++ = *from++;
    case 5: *to++ = *from++;
    case 4: *to++ = *from++;
    case 3: *to++ = *from++;
    case 2: *to++ = *from++;
    case 1: *to++ = *from++;
  } while (--n > 0); }
}
```

随着编译技术的发展，达夫设备的性能优化效果已经不明显，有些时候甚至会起到负优化的作用，可以参考这篇文章。但我依然认为达夫设备是一种极具智慧的设计。
https://belaycpp.com/2021/11/18/duffs-device-in-2021/

</div>

::right::

<div v-click-hide="7">

<div v-click="4">

一种简单的优化思路是在一次循环中尽可能多地复制数所，减少分支判断的占比。比如，我们可以一次复制 8 个字节：

```cpp
send(short *to, short *from, int count)
{
    int n = count / 8;
    do {
        *to++ = *from++;
        *to++ = *from++;
        *to++ = *from++;
        *to++ = *from++;
        *to++ = *from++;
        *to++ = *from++;
        *to++ = *from++;
        *to++ = *from++;
    } while (--n > 0);
}
```

</div>

</div>

<div v-click="7">

但是新插入的 while (n-- > 0) 最多会执行 7 次分支判断。为了进一步减少分支判断指令，我们可以改用 switch 语句：

```cpp
send(short *to, short *from, int count)
{
  int n = count % 8;
  switch (n) {
    case 7: *to++ = *from++;
    case 6: *to++ = *from++;
    case 5: *to++ = *from++;
    case 4: *to++ = *from++;
    case 3: *to++ = *from++;
    case 2: *to++ = *from++;
    case 1: *to++ = *from++;
    case 0: ;
  }

  n = count / 8;
  if (n == 0) return;
  do {
    *to++ = *from++;
    *to++ = *from++;
    *to++ = *from++;
    *to++ = *from++;
    *to++ = *from++;
    *to++ = *from++;
    *to++ = *from++;
    *to++ = *from++;
  } while (--n > 0);
}
```

对于任意长度，switch 语句可以通过一次比较确定 case 分支的位置。然后依次连续执行后续的 case 分支。这样就可以避免多次分支判断。

</div>

---
theme: default
layout: two-cols
---

# Go 语言零值

Go 语言默认会将变量设为零值。如果是很大的结构体或者很长的数组，Go 编译器会插入所谓的 duffzero 函数调用，以此来提高清零的效率。从函数名上就能看出，Go 语言也借鉴了达夫设备的思想。

duffzero 是一系列自动生成的汇编函数，本质上就是一组赋值指令。以 AMD64 平台为例：

```
MOVUPS  X15,(DI)
MOVUPS  X15,16(DI)
MOVUPS  X15,32(DI)
MOVUPS  X15,48(DI)
LEAQ    64(DI),DI
...
RET
```

DI 寄存器保存需要清零的目标地址，X15 是零值寄存器。MOVUPS 一次性清空 16 个字节。四个指令一组，可以一次清空 64 个字节。duffzero 系列函数由 mkduff.go https://go.dev/src/runtime/mkduff.go#L65 自动生成，不同目标平台的指令也各不相同。比如 AMD64 架构下一共会生成 16 组上清空指令，最多一次可以清空 1024 个字节。

虽说叫 duffzero，但与达夫设备的逻辑又有很大的不同。达夫设备通过动态计算配合 switch 语句来适配各种长度取值。Go 语言则是直接在编译期间根据要清零的长度计算出 duffzero 的偏移量，然后顺序执行清空指令。执行期间不需要动态计算和判断条件分支，所以效率更高。

如果你使用 go tool objdump 查看 Go 语言的汇编指令，可能会发现如下代码：

`CALL 0x105d4e2 ; 直接调用的函数地址，此地址指向 duffzero 内部某位置`

Go 编译器知道变量的长度后，会自动计算 https://go.dev/src/cmd/compile/internal/amd64/ggen.go#L36 duffzero 内部的偏移量：

```cpp
func dzOff(b int64) int64 {
  // 先指向最后的 RET 指令
  off := int64(dzSize)
  // dzClearLen 就是前面的分组清零长度，为 64 字节
  // dzBlockSize 为每个指令分组的长度
  off -= b / dzClearLen * dzBlockSize
  // 如果长度不能被 64 整除
  tailLen := b % dzClearLen
  if tailLen >= dzClearStep {
    // 计算分组内指令偏移量
    // dzLeaqSize 为 LEAQ 指令长度
    // dzMovSize 为 MOVUPS 指令长席
    off -= dzLeaqSize + dzMovSize*(tailLen/dzClearStep)
  }
  return off
}
```

通过dzOff函数，编译器就能确定需要实际调用 duffzero 的指令偏移量，然后插入一条 CALL 指令。

---
layout: cover
---

<div v-click="2" v-click-hide="4">
  Content shown on click 2, hidden on click 4.
</div>