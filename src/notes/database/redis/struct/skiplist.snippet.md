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