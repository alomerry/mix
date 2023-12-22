# Redis Command

- Generic
- String
  - get key 获取指定 key 的值
  - set key value 设置指定 key 的值
  - getrange key start end 返回 key 中字符串的子字符串
  - getset key value 将指定 key 的值设置为 value，并返回 key 的旧值
  - mset key value [key value] 设置一个或多个 key-value 对
  - mget key1 [key2] 获取一个或多个 key 的值
  - setnx key value 只有 key 不存在时才会设置 value
  - strlen key 返回 key 所储存的字符串值的长度
  - msetnx key value [key value] 给一个或多个 key 设置 value，当且仅当所有 key 都不存在时
  - incr key 将 key 中存储的数字值增加 1
  - incrby key increment 将 key 中的数字值增加 increment
  - append key value 在指定 key 的值后追加 value
  - incrbyfloat key decrement 将 key 所储存的值加上给定的浮点值
  - setex key seconds value 将 key 的值设为 value ，并将 key 的过期时间设为 seconds（单位：秒）
  - psetex key milliseconds value 将值 key 的值设为 value ，并将 key 的过期时间设为 seconds（单位：毫秒）
- Hash
  - hset key field value 将指定 key 的 field 属性设置为 value
  - hget key field 获取指定 key 的 field 字段值
  - hsetnx key field value 将指定 key 的 field 属性设置为 value，仅当 field 不存在时
  - hmget key field1 [field2] 获取指定 key 的一个或多个属性
  - hexists key field 检查指定 key 是否包含指定 field
  - hgetall key 获取指定 key 的所有字段和值
  - hincrby key field increment 给指定 key 的指定字段增加一个整数值 increment
  - hkeys key 获取指定 key 的所有属性
  - hlen key 获取指定 key 的属性数量
  - hvals key 获取指定 key 的所有属性值
  - hincrbyfloat key field increment 将指定 key 的 field 属性增加一个浮点值 increment
  - hdel key field [field2] 删除指定 key 的一个或多个属性
- List
  - lpush key value1 [value2] 将一个或多个值放入指定列表中
  - rpop key
  - blpop key1 [key2] timeout 从列表头部弹出一个元素，并返回该元素的值，如果列表为空会阻塞至可弹出元素或超出时间为止
  - brpop key1 [key2] timeout 从列表尾部弹出一个元素，并返回该元素的值，如果列表为空会阻塞至可弹出元素或超出时间为止
  - brpoplpush source destination timeout 从 source 列表的尾部弹出元素放置到 destination 列表的头部，如果 source 列表为空会阻塞至可弹出元素或超出时间为止
  - llen key 获取列表长度
  - lpop key 从列表头部弹出元素
  - lindex key index 获取列表指定位置的元素
  - linsert key before|after pivot value 在列表的 pivot 的前或后插入元素
  - lpushx key value 将元素插入已存在的列表头部，不存在时无法插入
  - lrange key start stop 获取指定范围内的列表元素
  - lrem key count value 从列表中删除和 value 相同的值，count 的值可以是以下几种：
    - count > 0 从头部向尾部搜索，删除 count 个与 value 相同值的元素。
    - count < 0 从尾部向头部搜索，删除 count 的绝对值个与 value 相同值的元素。
    - count = 0 移除列表中全部的与 value 相同值的元素。
  - lset key index value 通过索引修改指定列表的元素值
  - ltrim key start stop 将指定列表从 start 到 stop 进行修剪
  - rpoplpush source destination 将 source 列表的尾元素移出放置到 destination 列表的头部中。
  - rpush key value1 [value2] 向列表的尾部添加多个元素。
  - rpushx key value 在存在的列表的尾部添加元素。
- Set
  - sadd key member1 [member2] 向集合中添加一个或多个元素
  - scard key 获取集合中的元素数量
  - sdiff key1 [key2] 返回两个集合的差集，差集为 key1 集合的子集
  - sdiffstore destination key1 [key2] 将给定集合的差集存储在集合 destination 中，如果 destination 中已有数据，则会被覆盖，差集为 key1 的子集
  - sismember key member 判断 member 是否在集合中
  - smembers key 获取集合中的元素
  - smove source destination member 将 member 元素从 source 集合移动到 destination 集合中
  - spop key 移除并返回集合中的一个随机元素
  - srandmember key [count] 返回集合中一个或多个随机元素，count 的值可以是如下：
  - - count 为正数且小于集合容量，返回一个包含 count 个元素的数组。
  - - count 为正数且大于等于集合容量，返回包含集合全部元素的数组。
  - - count 为负数，返回一个容量为 count 绝对值的数组，且元素可能重复。
  - srem key member1 [member2] 移除集合中的一个或多个元素
  - sunion key1 [key2] 返回给定集合的并集
  - sunionstore destination key1 [key2] 将给定集合的并集保存至 destination 集合中
- zset
  - zadd key score1 member1 [score2 member2] 向有序集合添加一个或多个成员
  - zcard key 获取有序集合的成员数
  - zcount key min max 获取有序集合中指定分数间的成员数
  - zincrby key increment member 将有序集合中指定成员的分数增加 increment
  - zscore key member 返回有序集合中 member 的分数
  - zrevrank key member 返回有序集合中 member 的排名（分数由高到低）
  - zrank key member 返回有序集合中 member 的排名（分数由低到高）
  - zrem key member [member] 移除有序集合中一个或多个元素
  - zlexcount key min max 返回分数相同时指定字典序区间的成员数
  - zrangebyscore key min max [withscores] [limit offset count] 返回指定分数范围内的有序集合元素，按分数从小到大排序，添加 `withscores` 参数使结果包含分数，`limit`可以获取指定区间的结果
  - zrevrangebyscore key max min [withscores] 返回指定分数范围内的有序集合元素，按分数从大到小排序，分数一致时按字典序逆序排序
  - zremrangebylex key min max 移除有序集合中给定的字典区间的所有成员
  - zremrangebyrank key start stop 移除有序集合中给定的排名区间的所有成员
  - zremrangebyscore key min max 移除有序集合中给定的分数区间的所有成员
  - zunionstore destination numkeys key [key] 计算给定的一个或多个有序集的并集，并保存到 destination 中
  - zinterstore destination numkeys key [key] 计算给定的一个或多个有序集的交集，并保存到 destination 中
- BitMap
- HyperLogLog
- GEO
- Stream

## Reference

- https://xiaolincoding.com/redis/data_struct/command.html

[^string-cmd]:

    ```shell
    help @string

    APPEND key value
    summary: Append a value to a key
    since: 2.0.0

    BITCOUNT key [start end]
    summary: Count set bits in a string
    since: 2.6.0

    BITFIELD key [GET type offset] [SET type offset value] [INCRBY type offset increment] [OVERFLOW WRAP|SAT|FAIL]
    summary: Perform arbitrary bitfield integer operations on strings
    since: 3.2.0

    BITOP operation destkey key [key ...]
    summary: Perform bitwise operations between strings
    since: 2.6.0

    BITPOS key bit [start] [end]
    summary: Find first bit set or clear in a string
    since: 2.8.7

    DECR key
    summary: Decrement the integer value of a key by one
    since: 1.0.0

    DECRBY key decrement
    summary: Decrement the integer value of a key by the given number
    since: 1.0.0

    GET key
    summary: Get the value of a key
    since: 1.0.0

    GETBIT key offset
    summary: Returns the bit value at offset in the string value stored at key
    since: 2.2.0

    GETRANGE key start end
    summary: Get a substring of the string stored at a key
    since: 2.4.0

    GETSET key value
    summary: Set the string value of a key and return its old value
    since: 1.0.0

    INCR key
    summary: Increment the integer value of a key by one
    since: 1.0.0

    INCRBY key increment
    summary: Increment the integer value of a key by the given amount
    since: 1.0.0

    INCRBYFLOAT key increment
    summary: Increment the float value of a key by the given amount
    since: 2.6.0

    MGET key [key ...]
    summary: Get the values of all the given keys
    since: 1.0.0

    MSET key value [key value ...]
    summary: Set multiple keys to multiple values
    since: 1.0.1

    MSETNX key value [key value ...]
    summary: Set multiple keys to multiple values, only if none of the keys exist
    since: 1.0.1

    PSETEX key milliseconds value
    summary: Set the value and expiration in milliseconds of a key
    since: 2.6.0

    SET key value [expiration EX seconds|PX milliseconds] [NX|XX]
    summary: Set the string value of a key
    since: 1.0.0

    SETBIT key offset value
    summary: Sets or clears the bit at offset in the string value stored at key
    since: 2.2.0

    SETEX key seconds value
    summary: Set the value and expiration of a key
    since: 2.0.0

    SETNX key value
    summary: Set the value of a key, only if the key does not exist
    since: 1.0.0

    SETRANGE key offset value
    summary: Overwrite part of a string at key starting at the specified offset
    since: 2.2.0

    STRLEN key
    summary: Get the length of the value stored in a key
    since: 2.2.0
    ```

[^hash-cmd]:

    ```shell
    help @hash

    HDEL key field [field ...]
    summary: Delete one or more hash fields
    since: 2.0.0

    HEXISTS key field
    summary: Determine if a hash field exists
    since: 2.0.0

    HGET key field
    summary: Get the value of a hash field
    since: 2.0.0

    HGETALL key
    summary: Get all the fields and values in a hash
    since: 2.0.0

    HINCRBY key field increment
    summary: Increment the integer value of a hash field by the given number
    since: 2.0.0

    HINCRBYFLOAT key field increment
    summary: Increment the float value of a hash field by the given amount
    since: 2.6.0

    HKEYS key
    summary: Get all the fields in a hash
    since: 2.0.0

    HLEN key
    summary: Get the number of fields in a hash
    since: 2.0.0

    HMGET key field [field ...]
    summary: Get the values of all the given hash fields
    since: 2.0.0

    HMSET key field value [field value ...]
    summary: Set multiple hash fields to multiple values
    since: 2.0.0

    HSCAN key cursor [MATCH pattern] [COUNT count]
    summary: Incrementally iterate hash fields and associated values
    since: 2.8.0

    HSET key field value
    summary: Set the string value of a hash field
    since: 2.0.0

    HSETNX key field value
    summary: Set the value of a hash field, only if the field does not exist
    since: 2.0.0

    HSTRLEN key field
    summary: Get the length of the value of a hash field
    since: 3.2.0

    HVALS key
    summary: Get all the values in a hash
    since: 2.0.0
    ```

[^list-cmd]:

    ```shell
    help @list

    BLPOP key [key ...] timeout
    summary: Remove and get the first element in a list, or block until one is available
    since: 2.0.0

    BRPOP key [key ...] timeout
    summary: Remove and get the last element in a list, or block until one is available
    since: 2.0.0

    BRPOPLPUSH source destination timeout
    summary: Pop a value from a list, push it to another list and return it; or block until one is available
    since: 2.2.0

    LINDEX key index
    summary: Get an element from a list by its index
    since: 1.0.0

    LINSERT key BEFORE|AFTER pivot value
    summary: Insert an element before or after another element in a list
    since: 2.2.0

    LLEN key
    summary: Get the length of a list
    since: 1.0.0

    LPOP key
    summary: Remove and get the first element in a list
    since: 1.0.0

    LPUSH key value [value ...]
    summary: Prepend one or multiple values to a list
    since: 1.0.0

    LPUSHX key value
    summary: Prepend a value to a list, only if the list exists
    since: 2.2.0

    LRANGE key start stop
    summary: Get a range of elements from a list
    since: 1.0.0

    LREM key count value
    summary: Remove elements from a list
    since: 1.0.0

    LSET key index value
    summary: Set the value of an element in a list by its index
    since: 1.0.0

    LTRIM key start stop
    summary: Trim a list to the specified range
    since: 1.0.0

    RPOP key
    summary: Remove and get the last element in a list
    since: 1.0.0

    RPOPLPUSH source destination
    summary: Remove the last element in a list, prepend it to another list and return it
    since: 1.2.0

    RPUSH key value [value ...]
    summary: Append one or multiple values to a list
    since: 1.0.0

    RPUSHX key value
    summary: Append a value to a list, only if the list exists
    since: 2.2.0
    ```

[^set-cmd]:

    ```shell
    help @set

    SADD key member [member ...]
    summary: Add one or more members to a set
    since: 1.0.0

    SCARD key
    summary: Get the number of members in a set
    since: 1.0.0

    SDIFF key [key ...]
    summary: Subtract multiple sets
    since: 1.0.0

    SDIFFSTORE destination key [key ...]
    summary: Subtract multiple sets and store the resulting set in a key
    since: 1.0.0

    SINTER key [key ...]
    summary: Intersect multiple sets
    since: 1.0.0

    SINTERSTORE destination key [key ...]
    summary: Intersect multiple sets and store the resulting set in a key
    since: 1.0.0

    SISMEMBER key member
    summary: Determine if a given value is a member of a set
    since: 1.0.0

    SMEMBERS key
    summary: Get all the members in a set
    since: 1.0.0

    SMOVE source destination member
    summary: Move a member from one set to another
    since: 1.0.0

    SPOP key [count]
    summary: Remove and return one or multiple random members from a set
    since: 1.0.0

    SRANDMEMBER key [count]
    summary: Get one or multiple random members from a set
    since: 1.0.0

    SREM key member [member ...]
    summary: Remove one or more members from a set
    since: 1.0.0

    SSCAN key cursor [MATCH pattern] [COUNT count]
    summary: Incrementally iterate Set elements
    since: 2.8.0

    SUNION key [key ...]
    summary: Add multiple sets
    since: 1.0.0

    SUNIONSTORE destination key [key ...]
    summary: Add multiple sets and store the resulting set in a key
    since: 1.0.0
    ```

[^genertic-cmd]:

    ```shell
    help @generic

    DEL key [key ...]
    summary: Delete a key
    since: 1.0.0

    DUMP key
    summary: Return a serialized version of the value stored at the specified key.
    since: 2.6.0

    EXISTS key [key ...]
    summary: Determine if a key exists
    since: 1.0.0

    EXPIRE key seconds
    summary: Set a key's time to live in seconds
    since: 1.0.0

    EXPIREAT key timestamp
    summary: Set the expiration for a key as a UNIX timestamp
    since: 1.2.0

    KEYS pattern
    summary: Find all keys matching the given pattern
    since: 1.0.0

    MIGRATE host port key| destination-db timeout [COPY] [REPLACE] [KEYS key]
    summary: Atomically transfer a key from a Redis instance to another one.
    since: 2.6.0

    MOVE key db
    summary: Move a key to another database
    since: 1.0.0

    OBJECT subcommand [arguments [arguments ...]]
    summary: Inspect the internals of Redis objects
    since: 2.2.3

    PERSIST key
    summary: Remove the expiration from a key
    since: 2.2.0

    PEXPIRE key milliseconds
    summary: Set a key's time to live in milliseconds
    since: 2.6.0

    PEXPIREAT key milliseconds-timestamp
    summary: Set the expiration for a key as a UNIX timestamp specified in milliseconds
    since: 2.6.0

    PTTL key
    summary: Get the time to live for a key in milliseconds
    since: 2.6.0

    RANDOMKEY -
    summary: Return a random key from the keyspace
    since: 1.0.0

    RENAME key newkey
    summary: Rename a key
    since: 1.0.0

    RENAMENX key newkey
    summary: Rename a key, only if the new key does not exist
    since: 1.0.0

    RESTORE key ttl serialized-value [REPLACE]
    summary: Create a key using the provided serialized value, previously obtained using DUMP.
    since: 2.6.0

    SCAN cursor [MATCH pattern] [COUNT count]
    summary: Incrementally iterate the keys space
    since: 2.8.0

    SORT key [BY pattern] [LIMIT offset count] [GET pattern [GET pattern ...]] [ASC|DESC] [ALPHA] [STORE destination]
    summary: Sort the elements in a list, set or sorted set
    since: 1.0.0

    TOUCH key [key ...]
    summary: Alters the last access time of a key(s). Returns the number of existing keys specified.
    since: 3.2.1

    TTL key
    summary: Get the time to live for a key
    since: 1.0.0

    TYPE key
    summary: Determine the type stored at key
    since: 1.0.0

    UNLINK key [key ...]
    summary: Delete a key asynchronously in another thread. Otherwise it is just as DEL, but non blocking.
    since: 4.0.0

    WAIT numreplicas timeout
    summary: Wait for the synchronous replication of all the write commands sent in the context of the current connection
    since: 3.0.0

    HOST: ...options...
    summary: Help not available
    since: not known

    PFDEBUG arg arg ...options...
    summary: Help not available
    since: not known

    LATENCY arg ...options...
    summary: Help not available
    since: not known

    SUBSTR key arg arg 
    summary: Help not available
    since: not known

    REPLCONF ...options...
    summary: Help not available
    since: not known

    MODULE arg ...options...
    summary: Help not available
    since: not known

    ASKING 
    summary: Help not available
    since: not known

    GEORADIUSBYMEMBER_RO key arg arg arg ...options...
    summary: Help not available
    since: not known

    RESTORE-ASKING key arg arg ...options...
    summary: Help not available
    since: not known

    XSETID key arg 
    summary: Help not available
    since: not known

    PSYNC arg arg 
    summary: Help not available
    since: not known

    POST ...options...
    summary: Help not available
    since: not known

    PFSELFTEST 
    summary: Help not available
    since: not known

    LOLWUT ...options...
    summary: Help not available
    since: not known

    GEORADIUS_RO key arg arg arg arg ...options...
    summary: Help not available
    since: not known
    ```

[^zset-cmd]:

    ```shell
    help @sorted_set

    BZPOPMAX key [key ...] timeout
    summary: Remove and return the member with the highest score from one or more sorted sets, or block until one is available
    since: 5.0.0

    BZPOPMIN key [key ...] timeout
    summary: Remove and return the member with the lowest score from one or more sorted sets, or block until one is available
    since: 5.0.0

    ZADD key [NX|XX] [CH] [INCR] score member [score member ...]
    summary: Add one or more members to a sorted set, or update its score if it already exists
    since: 1.2.0

    ZCARD key
    summary: Get the number of members in a sorted set
    since: 1.2.0

    ZCOUNT key min max
    summary: Count the members in a sorted set with scores within the given values
    since: 2.0.0

    ZINCRBY key increment member
    summary: Increment the score of a member in a sorted set
    since: 1.2.0

    ZINTERSTORE destination numkeys key [key ...] [WEIGHTS weight] [AGGREGATE SUM|MIN|MAX]
    summary: Intersect multiple sorted sets and store the resulting sorted set in a new key
    since: 2.0.0

    ZLEXCOUNT key min max
    summary: Count the number of members in a sorted set between a given lexicographical range
    since: 2.8.9

    ZPOPMAX key [count]
    summary: Remove and return members with the highest scores in a sorted set
    since: 5.0.0

    ZPOPMIN key [count]
    summary: Remove and return members with the lowest scores in a sorted set
    since: 5.0.0

    ZRANGE key start stop [WITHSCORES]
    summary: Return a range of members in a sorted set, by index
    since: 1.2.0

    ZRANGEBYLEX key min max [LIMIT offset count]
    summary: Return a range of members in a sorted set, by lexicographical range
    since: 2.8.9

    ZRANGEBYSCORE key min max [WITHSCORES] [LIMIT offset count]
    summary: Return a range of members in a sorted set, by score
    since: 1.0.5

    ZRANK key member
    summary: Determine the index of a member in a sorted set
    since: 2.0.0

    ZREM key member [member ...]
    summary: Remove one or more members from a sorted set
    since: 1.2.0

    ZREMRANGEBYLEX key min max
    summary: Remove all members in a sorted set between the given lexicographical range
    since: 2.8.9

    ZREMRANGEBYRANK key start stop
    summary: Remove all members in a sorted set within the given indexes
    since: 2.0.0

    ZREMRANGEBYSCORE key min max
    summary: Remove all members in a sorted set within the given scores
    since: 1.2.0

    ZREVRANGE key start stop [WITHSCORES]
    summary: Return a range of members in a sorted set, by index, with scores ordered from high to low
    since: 1.2.0

    ZREVRANGEBYLEX key max min [LIMIT offset count]
    summary: Return a range of members in a sorted set, by lexicographical range, ordered from higher to lower strings.
    since: 2.8.9

    ZREVRANGEBYSCORE key max min [WITHSCORES] [LIMIT offset count]
    summary: Return a range of members in a sorted set, by score, with scores ordered from high to low
    since: 2.2.0

    ZREVRANK key member
    summary: Determine the index of a member in a sorted set, with scores ordered from high to low
    since: 2.0.0

    ZSCAN key cursor [MATCH pattern] [COUNT count]
    summary: Incrementally iterate sorted sets elements and associated scores
    since: 2.8.0

    ZSCORE key member
    summary: Get the score associated with the given member in a sorted set
    since: 1.2.0

    ZUNIONSTORE destination numkeys key [key ...] [WEIGHTS weight] [AGGREGATE SUM|MIN|MAX]
    summary: Add multiple sorted sets and store the resulting sorted set in a new key
    since: 2.0.0
    ```

