---
date: 2023-10-10
enableFootnotePopup: true
category:
  - Database
tag:
  - Redis
  - NoSQL
  - SkipList
  - C
---

# SkipList

7.2.1

```diff
-#define ZSKIPLIST_MAXLEVEL 64 /* Should be enough for 2^64 elements */
+#define ZSKIPLIST_MAXLEVEL 32 /* Should be enough for 2^64 elements */
```

## Struct

zskiplistNode[^zskiplistNode] 

zskiplistNode[^zskiplist]

[^zslCreateNode]

<!-- @include: ./skiplist.snippet.md -->
