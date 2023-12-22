# list

[list](https://github.com/redis/redis/blob/c95ff0f304bfb8f3228b7af63a0b8d4b9ad36468/src/adlist.c)

```c
typedef struct listNode {
    struct listNode *prev;
    struct listNode *next;
    void *value;
} listNode;

typedef struct list {
    listNode *head;
    listNode *tail;
    void *(*dup)(void *ptr);
    void (*free)(void *ptr);
    int (*match)(void *ptr, void *key);
    unsigned long len;
} list;
```


```c
list *listCreate(void)
{
    struct list *list;

    if ((list = zmalloc(sizeof(*list))) == NULL)
        return NULL;
    list->head = list->tail = NULL;
    list->len = 0;
    list->dup = NULL;
    list->free = NULL;
    list->match = NULL;
    return list;
}
```

## Reference

- https://xiaolincoding.com/redis/data_struct/data_struct.html#%E9%93%BE%E8%A1%A8