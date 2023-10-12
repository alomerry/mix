---
timeline: false
article: false
category:
  - Golang
tag:
  - Heap
---

# 堆内存

- arena
- page
- span

- mheap
  - mheap.central
    - mcentral
    - padding
- heapArena
  - bitmap
  - spans
  - pageInUse
  - pageMarks
  - pageSpecials
  - checkmarks
  - zeroedBase
- mspan
  - spanclass
  - nelem
  - freeIndex
  - allocBits
  - gcmarkBits
- mcentral
  - spanclass
  - partial
  - full
    - spanSet 已清扫
    - spanSet 未清扫
- mcache（p 的本地缓存）
  - alloc（*mspan）
  - tiny

## mallocgc

- 辅助 GC 64KB