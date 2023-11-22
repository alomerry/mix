---
timeline: false
article: false
---

```c
typedef struct zset {
    dict *dict;
    zskiplist *zsl;
} zset;
```