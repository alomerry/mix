---
title: 堆内存
update: 2024-02-27T20:36:56.146Z
duration: 1min
wordCount: 51
date: 2024-02-27T20:36:56.146Z
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
