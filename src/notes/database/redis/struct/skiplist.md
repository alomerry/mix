---
date: 2023-10-10
enableFootnotePopup: true
category:
  - Database
  - Redis
  - NoSQL
tag:
  - SkipList
  - C
---

# SkipList

[skiplist](https://github.com/redis/redis/blob/b26e8e321346518574ed7093df1fb6b8be9fd7d9/src/t_zset.c#L75)

```diff
-#define ZSKIPLIST_MAXLEVEL 64 /* Should be enough for 2^64 elements */
+#define ZSKIPLIST_MAXLEVEL 32 /* Should be enough for 2^64 elements */
```

## Struct

zskiplistNode[^zskiplistNode]

zskiplistNode[^zskiplist]

zslCreateNode[^zslCreateNode]

zslRandomLevel[^zslRandomLevel]

zslCreate[^zslCreate]

zslInsert[^zslInsert]

[^zslRandomLevel]:

    ```c
    /* Returns a random level for the new skiplist node we are going to create.
    * The return value of this function is between 1 and ZSKIPLIST_MAXLEVEL
    * (both inclusive), with a powerlaw-alike distribution where higher
    * levels are less likely to be returned. */
    int zslRandomLevel(void) {
        static const int threshold = ZSKIPLIST_P*RAND_MAX;
        int level = 1;
        while (random() < threshold)
            level += 1;
        return (level<ZSKIPLIST_MAXLEVEL) ? level : ZSKIPLIST_MAXLEVEL;
    }
    ```

[^zslCreate]:

    ```c
    /* Create a new skiplist. */
    zskiplist *zslCreate(void) {
        int j;
        zskiplist *zsl;

        zsl = zmalloc(sizeof(*zsl));
        zsl->level = 1;
        zsl->length = 0;
        zsl->header = zslCreateNode(ZSKIPLIST_MAXLEVEL,0,NULL);
        for (j = 0; j < ZSKIPLIST_MAXLEVEL; j++) {
            zsl->header->level[j].forward = NULL;
            zsl->header->level[j].span = 0;
        }
        zsl->header->backward = NULL;
        zsl->tail = NULL;
        return zsl;
    }
    ```

[^zslFree]:

    ```c
    /* Free a whole skiplist. */
    void zslFree(zskiplist *zsl) {
        zskiplistNode *node = zsl->header->level[0].forward, *next;

        zfree(zsl->header);
        while(node) {
            next = node->level[0].forward;
            zslFreeNode(node);
            node = next;
        }
        zfree(zsl);
    }
    ```

[^zskiplistNode]:

    ```c
    /* ZSETs use a specialized version of Skiplists */
    typedef struct zskiplistNode {
        sds ele;
        double score;
        struct zskiplistNode *backward;
        struct zskiplistLevel {
            struct zskiplistNode *forward;
            unsigned long span;
        } level[];
    } zskiplistNode;
    ```

[^zskiplist]:

    ```c
    typedef struct zskiplist {
        struct zskiplistNode *header, *tail;
        unsigned long length;
        int level;
    } zskiplist;
    ```

[^zslCreateNode]:

    ```c
    /* Create a skiplist node with the specified number of levels.
    * The SDS string 'ele' is referenced by the node after the call. */
    zskiplistNode *zslCreateNode(int level, double score, sds ele) {
        zskiplistNode *zn =
            zmalloc(sizeof(*zn)+level*sizeof(struct zskiplistLevel));
        zn->score = score;
        zn->ele = ele;
        return zn;
    }
    ```

[^zslDeleteNode]:

    ```c
    /* Internal function used by zslDelete, zslDeleteRangeByScore and
    * zslDeleteRangeByRank. */
    void zslDeleteNode(zskiplist *zsl, zskiplistNode *x, zskiplistNode **update) {
        int i;
        for (i = 0; i < zsl->level; i++) {
            if (update[i]->level[i].forward == x) {
                update[i]->level[i].span += x->level[i].span - 1;
                update[i]->level[i].forward = x->level[i].forward;
            } else {
                update[i]->level[i].span -= 1;
            }
        }
        if (x->level[0].forward) {
            x->level[0].forward->backward = x->backward;
        } else {
            zsl->tail = x->backward;
        }
        while(zsl->level > 1 && zsl->header->level[zsl->level-1].forward == NULL)
            zsl->level--;
        zsl->length--;
    }
    ```

[^zslInsert]:

    ```c
    /* Insert a new node in the skiplist. Assumes the element does not already
    * exist (up to the caller to enforce that). The skiplist takes ownership
    * of the passed SDS string 'ele'. */
    zskiplistNode *zslInsert(zskiplist *zsl, double score, sds ele) {
        zskiplistNode *update[ZSKIPLIST_MAXLEVEL], *x;
        unsigned long rank[ZSKIPLIST_MAXLEVEL];
        int i, level;

        serverAssert(!isnan(score));
        x = zsl->header;
        for (i = zsl->level-1; i >= 0; i--) {
            /* store rank that is crossed to reach the insert position */
            rank[i] = i == (zsl->level-1) ? 0 : rank[i+1];
            while (x->level[i].forward &&
                    (x->level[i].forward->score < score ||
                        (x->level[i].forward->score == score &&
                        sdscmp(x->level[i].forward->ele,ele) < 0)))
            {
                rank[i] += x->level[i].span;
                x = x->level[i].forward;
            }
            update[i] = x;
        }
        /* we assume the element is not already inside, since we allow duplicated
        * scores, reinserting the same element should never happen since the
        * caller of zslInsert() should test in the hash table if the element is
        * already inside or not. */
        level = zslRandomLevel();
        if (level > zsl->level) {
            for (i = zsl->level; i < level; i++) {
                rank[i] = 0;
                update[i] = zsl->header;
                update[i]->level[i].span = zsl->length;
            }
            zsl->level = level;
        }
        x = zslCreateNode(level,score,ele);
        for (i = 0; i < level; i++) {
            x->level[i].forward = update[i]->level[i].forward;
            update[i]->level[i].forward = x;

            /* update span covered by update[i] as x is inserted here */
            x->level[i].span = update[i]->level[i].span - (rank[0] - rank[i]);
            update[i]->level[i].span = (rank[0] - rank[i]) + 1;
        }

        /* increment span for untouched levels */
        for (i = level; i < zsl->level; i++) {
            update[i]->level[i].span++;
        }

        x->backward = (update[0] == zsl->header) ? NULL : update[0];
        if (x->level[0].forward)
            x->level[0].forward->backward = x;
        else
            zsl->tail = x;
        zsl->length++;
        return x;
    }
    ```

