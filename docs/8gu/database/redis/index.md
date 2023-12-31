# Redis

## 数据类型

### 数据类型

:::: tip Redis 常见数据类型和应用场景
::: details
- String（sds）
  - 缓存对象
  - 常规计数
  - 分布式锁
  - 共享 Session 信息
- List（quicklist）
  - 消息队列 消息保序、处理重复的消息和保证消息可靠性
    - BRPOPLPUSH
    - 不支持多个消费者消费同一条消息
- Hash（哈希表、listpack）
  - 缓存对象
  - 购物车
- Set（哈希表或整数集合）
  - 点赞 SCARD、SMEMBERS
  - 共同关注 SINTER、SDIFF、SISMEMBER
  - 抽奖活动 SRANDMEMBER、SPOP、
- ZSet
  - 排行榜 ZREVRANGE
  - 电话、姓名排序
- Bitmap（String）
  - 签到统计
  - 判断用户登陆态
  - 连续签到用户总数
:::
::::

### 数据结构

- sds
- zskiplist
- dictht


## 过期/淘汰

### 过期

<!-- #region -->
:::: tip 过期删除策略有哪些？
::: details
- 定时删除 在设置 key 的过期时间时，同时创建一个定时事件，当时间到达时，由事件处理器自动执行 key 的删除操作
  - 优点 可以保证过期 key 会被尽快删除，也就是内存可以被尽快地释放。因此，定时删除对内存是最友好的
  - 缺点 在过期 key 比较多的情况下，删除过期 key 可能会占用相当一部分 CPU 时间，在内存不紧张但 CPU 时间紧张的情况下，将 CPU 时间用于删除和当前任务无关的过期键上，无疑会对服务器的响应时间和吞吐量造成影响。所以，定时删除策略对 CPU 不友好
- 惰性删除 不主动删除过期键，每次从数据库访问 key 时，都检测 key 是否过期，如果过期则删除该 key
  - 优点 因为每次访问时，才会检查 key 是否过期，所以此策略只会使用很少的系统资源，因此，惰性删除策略对 CPU 时间最友好
  - 缺点 如果一个 key 已经过期，而这个 key 又仍然保留在数据库中，那么只要这个过期 key 一直没有被访问，它所占用的内存就不会释放，造成了一定的内存空间浪费。所以，惰性删除策略对内存不友好
- 定期删除 每隔一段时间「随机」从数据库中取出一定数量的 key 进行检查，并删除其中的过期key
  - 优点 通过限制删除操作执行的时长和频率，来减少删除操作对 CPU 的影响，同时也能删除一部分过期的数据减少了过期键对空间的无效占用
  - 缺点
    - 内存清理方面没有定时删除效果好，同时没有惰性删除使用的系统资源少
    - 难以确定删除操作执行的时长和频率。如果执行的太频繁，定期删除策略变得和定时删除策略一样，对CPU不友好；如果执行的太少，那又和惰性删除一样了，过期 key 占用的内存不会及时得到释放
:::
::::
<!-- #endregion -->

::: tip Redis 过期删除策略是什么？
「惰性删除+定期删除」这两种策略配和使用。Redis 在访问或者修改 key 之前，都会调用 expireIfNeeded 函数对其进行检查，检查 key 是否过期

- 如果过期，则删除该 key，至于选择异步删除，还是选择同步删除，根据 lazyfree_lazy_expire 参数配置决定（Redis 4.0版本开始提供参数），然后返回 null 客户端
- 如果没有过期，不做任何处理，然后返回正常的键值对给客户端
:::

::: tip Redis 是怎么实现定期删除的？
每隔一段时间「随机」从数据库中取出一定数量的 key 进行检查，并删除其中的过期key。

- 默认每秒进行 10 次过期检查一次数据库，此配置可通过 Redis 的配置文件 redis.conf 进行配置，配置键为 hz 它的默认值是 hz 10
- 每轮抽查时，会随机选择 20 个 key 判断是否过期

流程：

- 从过期字典中随机抽取 20 个 key
- 检查这 20 个 key 是否过期，并删除已过期的 key
- 如果本轮检查的已过期 key 的数量，超过 5 个（20/4），也就是「已过期 key 的数量」占比「随机抽取 key 的数量」大于 25%，则继续重复步骤 1；如果已过期的 key 比例小于 25%，则停止继续删除过期 key，然后等待下一轮再检查
:::

::: tip 如何判定 key 已过期了？
每当我们对一个 key 设置了过期时间时，Redis 会把该 key 带上过期时间存储到一个过期字典（expires dict）中，也就是说「过期字典」保存了数据库中所有 key 的过期时间。字典实际上是哈希表，哈希表的最大好处就是让我们可以用 O(1) 的时间复杂度来快速查找。当我们查询一个 key 时，Redis 首先检查该 key 是否存在于过期字典中：

- 如果不在，则正常读取键值；
- 如果存在，则会获取该 key 的过期时间，然后与当前系统时间进行比对，如果比系统时间大，那就没有过期，否则判定该 key 已过期
:::

### 淘汰

:::: tip Redis 内存淘汰策略有哪些？
::: details
- 不进行数据淘汰的策略
- 进行数据淘汰的策略
  - 在设置了过期时间的数据中进行淘汰
    - volatile-random：随机淘汰设置了过期时间的任意键值
    - volatile-ttl：优先淘汰更早过期的键值
    - volatile-lru（Redis3.0 之前，默认的内存淘汰策略）：淘汰所有设置了过期时间的键值中，最久未使用的键值
    - volatile-lfu（Redis 4.0 后新增的内存淘汰策略）：淘汰所有设置了过期时间的键值中，最少使用的键值
  - 在所有数据范围内进行淘汰
    - allkeys-random：随机淘汰任意键值
    - allkeys-lru：淘汰整个键值中最久未使用的键值
    - allkeys-lfu（Redis 4.0 后新增的内存淘汰策略）：淘汰整个键值中最少使用的键值
:::
::::

:::: tip LRU 算法和 LFU 算法有什么区别？
::: details
- LRU 全称是 Least Recently Used 翻译为最近最少使用，会选择淘汰最近最少使用的数据

  传统 LRU 算法的实现是基于「链表」结构，链表中的元素按照操作顺序从前往后排列，最新操作的键会被移动到表头，当需要内存淘汰时，只需要删除链表尾部的元素即可，因为链表尾部的元素就代表最久未被使用的元素

  Redis 并没有使用这样的方式实现 LRU 算法，因为传统的 LRU 算法存在两个问题：

  - 需要用链表管理所有的缓存数据，这会带来额外的空间开销
  - 当有数据被访问时，需要在链表上把该数据移动到头端，如果有大量数据被访问，就会带来很多链表移动操作，会很耗时，进而会降低 Redis 缓存性能
  
  Redis 实现的是一种近似 LRU 算法，目的是为了更好的节约内存，它的实现方式是在 Redis 的对象结构体中添加一个额外的字段，用于记录此数据的最后一次访问时间。

  当 Redis 进行内存淘汰时，会使用随机采样的方式来淘汰数据，它是随机取 5 个值（此值可配置），然后淘汰最久没有使用的那个

  Redis 实现的 LRU 算法的优点：

  - 不用为所有的数据维护一个大链表，节省了空间占用
  - 不用在每次数据访问时都移动链表项，提升了缓存的性能

  缺点：无法解决缓存污染问题，比如应用一次读取了大量的数据，而这些数据只会被读取这一次，那么这些数据会留存在 Redis 缓存中很长一段时间，造成缓存污染
- LFU 全称是 Least Frequently Used 翻译为最近最不常用，LFU 算法是根据数据访问次数来淘汰数据的，它的核心思想是“如果数据过去被访问多次，那么将来被访问的频率也更高”。
  - Redis对象头的 24 bits 的 lru 字段被分成两段来存储，高 16bit 存储 ldt(Last Decrement Time)，低 8bit 存储 logc(Logistic Counter)
  - ldt 是用来记录 key 的访问时间戳
  - logc 是用来记录 key 的访问频次，它的值越小表示使用频率越低，越容易淘汰，每个新加入的 key 的logc 初始值为 5。logc 并不是单纯的访问次数，而是访问频次（访问频率），因为 logc 会随时间推移而衰减的

  在每次 key 被访问时，会先对 logc 做一个衰减操作，衰减的值跟前后访问时间的差距有关系，如果上一次访问的时间与这一次访问的时间差距很大，那么衰减的值就越大，这样实现的 LFU 算法是根据访问频率来淘汰数据的，而不只是访问次数。访问频率需要考虑 key 的访问是多长时间段内发生的。key 的先前访问距离当前时间越长，那么这个 key 的访问频率相应地也就会降低，这样被淘汰的概率也会更大

  对 logc 做完衰减操作后，就开始对 logc 进行增加操作，增加操作并不是单纯的 + 1，而是根据概率增加，如果 logc 越大的 key，它的 logc 就越难再增加。

  所以，Redis 在访问 key 时，对于 logc 是这样变化的：

  - 先按照上次访问距离当前的时长，来对 logc 进行衰减；
  - 然后，再按照一定概率增加 logc 的值
:::
::::

## 持久化

### AOF

Redis 每执行一条写操作命令，就把该命令以追加的方式写入到一个文件里，然后重启 Redis 的时候，先去读取这个文件里的命令，并且执行它，这种保存写操作命令到日志的持久化方式，就是 Redis 里的 AOF(Append Only File) 持久化功能

::: tip 先执行写操作命令 到 AOF 好处
- 避免额外的检查开销
- 不会阻塞当前写操作命令的执行
:::

::: tip 先执行写操作命令 到 AOF 缺点
- 数据就会有丢失的风险
- 可能会给「下一个」命令带来阻塞风险
:::

::: tip 三种写回策略
- Always 可以最大程度保证数据不丢失，不可避免会影响主进程的性能
- Everysec 避免了 Always 策略的性能开销，也比 No 策略更能避免数据丢失
- No 交由操作系统来决定何时将 AOF 日志内容写回硬盘，可能会丢失不定数量的数据
:::

::: tip AOF 重写机制
重写机制：当某个键值对被多条写命令反复修改，最终只根据这个「键值对」当前的最新状态，然后用一条命令去记录键值对，代替之前记录这个键值对的多条命令，减少了 AOF 文件中的命令数量
:::

::: tip AOF 后台重写子进程 bgrewriteaof
- 子进程进行 AOF 重写期间，主进程可以继续处理命令请求，从而避免阻塞主进程
- 子进程带有主进程的数据副本，并且写时复制 cow
:::

::: tip 在 bgrewriteaof 子进程执行 AOF 重写期间，主进程需要执行的操作
- 执行客户端发来的命令；
- 将执行后的写命令追加到 「AOF 缓冲区」；
- 将执行后的写命令追加到 「AOF 重写缓冲区」；

当子进程完成 AOF 重写工作向主进程发送一条信号，主进程收到该信号后，会调用一个信号处理函数：

- 将 AOF 重写缓冲区中的所有内容追加到新的 AOF 的文件中，使得新旧两个 AOF 文件所保存的数据库状态一致
- 新的 AOF 的文件进行改名，覆盖现有的 AOF 文件
:::

### RDB

::: tip 快照怎么用？
- 执行了 save 命令，就会在主线程生成 RDB 文件，由于和执行操作命令在同一个线程，所以如果写入 RDB 文件的时间太长，会阻塞主线程
- 执行了 bgsave 命令，会创建一个子进程来生成 RDB 文件，这样可以避免主线程的阻塞
  - 可通过配置文件的选项来实现每隔一段时间自动执行一次 bgsave
:::

## 高可用

### 主从复制

主从复制共有三种模式：全量复制、基于长连接的命令传播、增量复制。

:::: tip 第一次同步
::: details
主从服务器间的第一次同步的过程可分为三个阶段

- 第一阶段是建立链接、协商同步：执行了 replicaof 命令后，从服务器就会给主服务器发送 psync 命令（主服务器的 runID 和复制进度 offset），表示要进行数据同步
- 第二阶段是主服务器同步数据给从服务器：执行 bgsave 命令来生成 RDB 文件，然后把文件发送给从服务器，从服务器收到 RDB 文件后，会先清空当前的数据，然后载入 RDB 文件
  - 为了保证主从服务器的数据一致性，主服务器在下面这三个时间间隙中将收到的写操作命令，写入到 replication buffer 缓冲区里：
    - 主服务器生成 RDB 文件期间；
    - 主服务器发送 RDB 文件给从服务器期间；
    - 「从服务器」加载 RDB 文件期间；
- 第三阶段是主服务器发送新写操作命令给从服务器：主服务器将 replication buffer 缓冲区里所记录的写操作命令发送给从服务器，从服务器执行来自主服务器 replication buffer 缓冲区里发来的命令，这时主从服务器的数据就一致了
:::
::::

:::: tip 网络恢复后的增量复制
::: details
- 从服务器在恢复网络后，会发送 psync 命令给主服务器，此时的 psync 命令里的 offset 参数不是 -1；
- 主服务器收到该命令后，然后用 CONTINUE 响应命令告诉从服务器接下来采用增量复制的方式同步数据；
- 然后主服务将主从服务器断线期间，所执行的写命令发送给从服务器，然后从服务器执行这些命令。
:::
::::

:::: tip 主服务器怎么知道要将哪些增量数据发送给从服务器呢？
- repl_backlog_buffer，是一个「环形」缓冲区，用于主从服务器断连后，从中找到差异的数据；
- replication offset，标记上面那个缓冲区的同步进度，主从服务器都有各自的偏移量，主服务器使用 master_repl_offset 来记录自己「写」到的位置，从服务器使用 slave_repl_offset 来记录自己「读」到的位置

网络断开后，当从服务器重新连上主服务器时，从服务器会通过 psync 命令将自己的复制偏移量 slave_repl_offset 发送给主服务器，主服务器根据自己的 master_repl_offset 和 slave_repl_offset 之间的差距，然后来决定对从服务器执行哪种同步操作：

- 如果判断出从服务器要读取的数据还在 repl_backlog_buffer 缓冲区里，那么主服务器将采用增量同步的方式；
- 相反，如果判断出从服务器要读取的数据已经不存在 repl_backlog_buffer 缓冲区里，那么主服务器将采用全量同步的方式。
::::

::: tip 怎么判断 Redis 某个节点是否正常工作？
Redis 判断节点是否正常工作，基本都是通过互相的 ping-pong 心态检测机制，如果有一半以上的节点去 ping 一个节点的时候没有 pong 回应，集群就会认为这个节点挂掉了，会断开与这个节点的连接。

Redis 主从节点发送的心态间隔是不一样的，而且作用也有一点区别：

- Redis 主节点默认每隔 10 秒对从节点发送 ping 命令，判断从节点的存活性和连接状态，可通过参数repl-ping-slave-period控制发送频率。
- Redis 从节点每隔 1 秒发送 replconf ack{offset} 命令，给主节点上报自身当前的复制偏移量，目的是为了：
  - 实时监测主从节点网络状态；
  - 上报自身复制偏移量， 检查复制数据是否丢失， 如果从节点数据丢失， 再从主节点的复制缓冲区中拉取丢失数据。
:::

::: tip Redis 是同步复制还是异步复制？
Redis 主节点每次收到写命令之后，先写到内部的缓冲区，然后异步发送给从节点
:::

::: tip 主从复制中两个 Buffer(replication buffer 、repl backlog buffer)有什么区别？
- 出现的阶段不一样：
  - repl backlog buffer 是在增量复制阶段出现，一个主节点只分配一个 repl backlog buffer；
  - replication buffer 是在全量复制阶段和增量复制阶段都会出现，主节点会给每个新连接的从节点，分配一个 replication buffer；
- 这两个 Buffer 都有大小限制的，当缓冲区满了之后，发生的事情不一样：
  - 当 repl backlog buffer 满了，因为是环形结构，会直接覆盖起始位置数据;
  - 当 replication buffer 满了，会导致连接断开，删除缓存，从节点重新连接，重新开始全量复制。
:::

::: tip 为什么会出现主从数据不一致？
主从数据不一致，就是指客户端从从节点中读取到的值和主节点中的最新值并不一致。

之所以会出现主从数据不一致的现象，是因为主从节点间的命令复制是异步进行的，所以无法实现强一致性保证（主从数据时时刻刻保持一致）。

具体来说，在主从节点命令传播阶段，主节点收到新的写命令后，会发送给从节点。但是，主节点并不会等到从节点实际执行完命令后，再把结果返回给客户端，而是主节点自己在本地执行完命令后，就会向客户端返回结果了。如果从节点还没有执行主节点同步过来的命令，主从节点间的数据就不一致了。
:::

::: tip 如何如何应对主从数据不一致？
- 尽量保证主从节点间的网络连接状况良好，避免主从节点在不同的机房。
- 可以开发一个外部程序来监控主从节点间的复制进度。具体做法：
  - Redis 的 INFO replication 命令可以查看主节点接收写命令的进度信息（master_repl_offset）和从节点复制写命令的进度信息（slave_repl_offset），所以，我们就可以开发一个监控程序，先用 INFO replication 命令查到主、从节点的进度，然后，我们用 master_repl_offset 减去 slave_repl_offset，这样就能得到从节点和主节点间的复制进度差值了。
  - 如果某个从节点的进度差值大于我们预设的阈值，我们可以让客户端不再和这个从节点连接进行数据读取，这样就可以减少读到不一致数据的情况。不过，为了避免出现客户端和所有从节点都不能连接的情况，我们需要把复制进度差值的阈值设置得大一些。
:::

::: tip 主从切换过程中，产生数据丢失的情况
- 异步复制同步丢失 

  对于 Redis 主节点与从节点之间的数据复制，是异步复制的，当客户端发送写请求给主节点的时候，客户端会返回 ok，接着主节点将写请求异步同步给各个从节点，但是如果此时主节点还没来得及同步给从节点时发生了断电，那么主节点内存中的数据会丢失

  - Redis 配置里有一个参数 min-slaves-max-lag，表示一旦所有的从节点数据复制和同步的延迟都超过了 min-slaves-max-lag 定义的值，那么主节点就会拒绝接收任何请求
  - 对于客户端，当客户端发现 master 不可写后，我们可以采取降级措施，将数据暂时写入本地缓存和磁盘、MQ 中
- 集群产生脑裂数据丢失
  - min-slaves-to-write x，主节点必须要有至少 x 个从节点连接，如果小于这个数，主节点会禁止写数据
  - min-slaves-max-lag x，主从数据复制和同步的延迟不能超过 x 秒，如果主从同步的延迟超过 x 秒，主节点会禁止写数据
:::

### 哨兵

::: tip 哨兵机制是如何工作的？
哨兵会每隔 1 秒给所有主从节点发送 PING 命令，当主从节点收到 PING 命令后，会发送一个响应命令给哨兵，这样就可以判断它们是否在正常运行。如果主节点或者从节点没有在规定的时间内响应哨兵的 PING 命令，哨兵就会将它们标记为「主观下线」。当一个哨兵判断主节点为「主观下线」后，就会向其他哨兵发起命令，其他哨兵收到这个命令后，就会根据自身和主节点的网络状况，做出赞成投票或者拒绝投票的响应。当这个哨兵的赞同票数达到哨兵配置文件中的 quorum 配置项设定的值后，这时主节点就会被该哨兵标记为「客观下线」。哨兵判断完主节点客观下线后，哨兵就要开始在多个「从节点」中，选出一个从节点来做新主节点。
:::

::: tip 由哪个哨兵进行主从故障转移？
在哨兵集群中选出一个 leader，让 leader 来执行主从切换。哪个哨兵节点判断主节点为「客观下线」，这个哨兵节点就是候选者，所谓的候选者就是想当 Leader 的哨兵。

当哨兵收到赞成票数达到哨兵配置文件中的 quorum 配置项设定的值后，就会将主节点标记为「客观下线」，此时的哨兵 B 就是一个 Leader 候选者。
:::

::: tip 候选者如何选举成为 Leader？
候选者会向其他哨兵发送命令，表明希望成为 Leader 来执行主从切换，并让所有其他哨兵对它进行投票。

每个哨兵只有一次投票机会，如果用完后就不能参与投票了，可以投给自己或投给别人，但是只有候选者才能把票投给自己。

那么在投票过程中，任何一个「候选者」，要满足两个条件：

- 拿到半数以上的赞成票；
- 拿到的票数同时还需要大于等于哨兵配置文件中的 quorum 值。
:::

::: tip 主从故障转移的过程是怎样的？
- 在已下线主节点（旧主节点）属下的所有「从节点」里面，挑选出一个从节点，并将其转换为主节点。
  - 过滤已经下线的从节点
  - 过滤以往网络连接状态不好的从节点
  - 优先级过滤 哨兵首先会根据从节点的优先级来进行排序，优先级越小排名越靠前
  - 复制进度 如果优先级相同，则查看复制的下标，哪个从「主节点」接收的复制数据多，哪个就靠前
  - 如果优先级和下标都相同，就选择从节点 ID 较小的那个
- 让已下线主节点属下的所有「从节点」修改复制目标，修改为复制「新主节点」
- 将新主节点的 IP 地址和信息，通过「发布者/订阅者机制」通知给客户端
- 继续监视旧主节点，当这个旧主节点重新上线时，将它设置为新主节点的从节点；
:::

### 集群

## 缓存

<!-- #region -->
:::: tip 什么是缓存雪崩、击穿、穿透？
::: details
- 缓存雪崩 请求无法在 Redis 中处理，于是全部请求都直接访问数据库，导致数据库的压力骤增
  - 大量缓存同时过期
    - 均匀设置过期时间 过期时间加上一个随机数
    - 互斥锁 保证同一时间内只有一个请求来构建缓存（超时时间）
    - 双 key 策略；
    - 后台更新缓存
      - 缓存不设置有效期，并将更新缓存的工作交由后台线程定时更新
  - redis 故障
    - 服务熔断或请求限流机制
    - 构建 Redis 缓存高可靠集群
- 缓存击穿 缓存中的某个热点数据过期了，大量的请求访问了该热点数据，无法从缓存中读取，直接访问数据库
- 缓存穿透 当用户访问的数据，既不在缓存中，也不在数据库中
  - 原因
    - 业务误操作
    - 黑客恶意攻击
  - 方案
    - 非法请求的限制
    - 缓存空值或者默认值
    - 使用[布隆过滤器](https://xiaolincoding.com/redis/cluster/cache_problem.html#%E7%BC%93%E5%AD%98%E7%A9%BF%E9%80%8F)快速判断数据是否存在，避免通过查询数据库来判断数据是否存在
:::
::::
<!-- #endregion -->

## 大 key 问题

::: tip 什么是 Redis 大 key？
- String 类型的值大于 10 KB
- Hash、List、Set、ZSet 类型的元素的个数超过 5000个
:::

::: tip 大 key 会造成什么问题？
- 客户端超时阻塞。由于 Redis 执行命令是单线程处理，然后在操作大 key 时会比较耗时，那么就会阻塞 Redis，从客户端这一视角看，就是很久很久都没有响应。
- 引发网络阻塞。每次获取大 key 产生的网络流量较大，如果一个 key 的大小是 1 MB，每秒访问量为 1000，那么每秒会产生 1000MB 的流量，这对于普通千兆网卡的服务器来说是灾难性的。
- 阻塞工作线程。如果使用 del 删除大 key 时，会阻塞工作线程，这样就没办法处理后续的命令。
- 内存分布不均。集群模型在 slot 分片均匀情况下，会出现数据和查询倾斜情况，部分有大 key 的 Redis 节点占用内存多，QPS 也会比较大
:::

::: tip 大 Key 对持久化有什么影响？
- AOF
  - 当使用 Always 策略的时候，如果写入是一个大 Key，主线程在执行 fsync() 函数的时候，阻塞的时间会比较久，因为当写入的数据量很大的时候，数据同步到硬盘这个过程是很耗时的
  - 当使用 Everysec 策略的时候，由于是异步执行 fsync() 函数，所以大 Key 持久化的过程（数据同步磁盘）不会影响主线程
  - 当使用 No 策略的时候，由于永不执行 fsync() 函数，所以大 Key 持久化的过程不会影响主线程
- AOF 重写/RDB
  - 当 AOF 日志写入了很多的大 Key，AOF 日志文件的大小会很大，会频繁触发 AOF 重写机制
  - 通过 fork() 函数创建子进程的时，内核会把父进程的页表复制一份给子进程，如果页表很大，那么这个复制过程是会很耗时的，那么在执行 fork 函数的时候就会发生阻塞现象
  - 创建完子进程后，如果父进程修改了共享数据中的大 Key，就会发生写时复制，这期间会拷贝物理内存，由于大 Key 占用的物理内存会很大，那么在复制物理内存这一过程，就会比较耗时，所以有可能会阻塞父进程
:::

<!-- #region -->
:::: tip 如何找到大 key？
::: details
- redis-cli --bigkeys 查找大key
  - 注意事项
    - 最好选择在从节点上执行该命令。因为主节点上执行时，会阻塞主节点
    - 如果没有从节点，那么可以选择在 Redis 实例业务压力的低峰阶段进行扫描查询，以免影响到实例的正常运行；或者可以使用 -i 参数控制扫描间隔，避免长时间扫描降低 Redis 实例的性能
  - 不足
    - 这个方法只能返回每种类型中最大的那个 bigkey，无法得到大小排在前 N 位的 bigkey
    - 对于集合类型来说，这个方法只统计集合元素个数的多少，而不是实际占用的内存量。但是，一个集合中的元素个数多，并不一定占用的内存就多。因为，有可能每个元素占用的内存很小，这样的话，即使元素个数有很多，总内存开销也不大
- 使用 SCAN 命令查找大 key 
  - 使用 SCAN 命令对数据库扫描，然后用 TYPE 命令获取返回的每一个 key 的类型
  - 对于 String 类型，可以直接使用 STRLEN 命令获取字符串的长度，也就是占用的内存空间字节数。
  - 如果能够预先从业务层知道集合元素的平均大小，那么，可以使用下面的命令获取集合元素的个数，然后乘以集合元素的平均大小，这样就能获得集合占用的内存大小了。List 类型：LLEN 命令；Hash 类型：HLEN 命令；Set 类型：SCARD 命令；Sorted Set 类型：ZCARD 命令
  - 如果不能提前知道写入集合的元素大小，可以使用 MEMORY USAGE 命令（需要 Redis 4.0 及以上版本），查询一个键值对占用的内存空间
:::
::::
<!-- #endregion -->

<!-- #region -->
:::: tip 如何删除大 key？
::: details
删除操作的本质是要释放键值对占用的内存空间，为了更加高效地管理内存空间，在应用程序释放内存时，操作系统需要把释放掉的内存块插入一个空闲内存块的链表，以便后续进行管理和再分配。这个过程本身需要一定时间，而且会阻塞当前释放内存的应用程序。如果一下子释放了大量内存，空闲内存块链表操作时间就会增加，相应地就会造成 Redis 主线程的阻塞，如果主线程发生了阻塞，其他所有请求可能都会超时，超时越来越多，会造成 Redis 连接耗尽，产生各种异常。

- 分批次删除
  - 删除大 Hash hscan hdel
  - 删除大 List，通过 ltrim
  - 删除大 Set，使用 sscan，srem
  - 删除大 ZSet，使用 zremrangebyrank
- 异步删除
  - 用 unlink 命令代替 del 来删除
  - 通过配置参数
    - lazyfree-lazy-eviction：表示当 Redis 运行内存超过 maxmeory 时，是否开启 lazy free 机制删除
    - lazyfree-lazy-expire：表示设置了过期时间的键值，当过期之后是否开启 lazy free 机制删除
    - lazyfree-lazy-server-del：有些指令在处理已存在的键时，会带有一个隐式的 del 键的操作，比如 rename 命令，当目标键已存在，Redis 会先删除目标键，如果这些目标键是一个 big key，就会造成阻塞删除的问题，此配置表示在这种场景中是否开启 lazy free 机制删除
    - slave-lazy-flush：针对 slave (从节点) 进行全量数据同步，slave 在加载 master 的 RDB 文件前，会运行 flushall 来清理自己的数据，它表示此时是否开启 lazy free 机制删除
:::
::::
<!-- #endregion -->

## 分布式锁

::: tip 如何用 Redis 实现分布式锁的？
Redis 的 SET 命令有个 NX 参数可以实现「key不存在才插入」，所以可以用它来实现分布式锁
:::

::: tip 基于 Redis 实现分布式锁的优点
- 性能高效
- 实现方便
- 避免单点故障
:::

::: tip 基于 Redis 实现分布式锁的缺点
- 超时时间不好设置
  - 那么如何合理设置超时时间呢？可以基于续约的方式设置超时时间
- Redis 主从复制模式中的数据是异步复制的，这样导致分布式锁的不可靠性
  - Redis 主节点获取到锁后，在没有同步到其他节点时，Redis 主节点宕机了，此时新的 Redis 主节点依然可以获取锁
:::

::: tip Redis 如何解决集群情况下分布式锁的可靠性？
Redis 官方已经设计了一个分布式锁算法 [Redlock](https://xiaolincoding.com/redis/base/redis_interview.html#redis-%E5%AE%9E%E6%88%98)
:::

## 分布式缓存

[读写缓存](https://github.com/Ccww-lx/JavaCommunity/blob/master/doc/db/redis/Redis%E7%BC%93%E5%AD%98%E6%80%BB%E7%BB%93.md)

## 其它

redis 未查到，数据也未查到需要记录 key 防止多次穿透

- 讲一下 Redis 集群高可用、主从复制的理解
  - https://xiaolincoding.com/redis/cluster/master_slave_replication.html
- redis 做补偿的时候挂了怎么办
- redis 数据结构 用在哪些场景？说一下五种 redis 数据结构和之间的实现方式
  - https://xiaolincoding.com/redis/data_struct/data_struct.html
  - https://xiaolincoding.com/redis/data_struct/command.html
  - https://xiaolincoding.com/redis/base/redis_interview.html#redis-%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84
- 热 key 问题的解决
- 哨兵
- redis 和数据库数据不一致（延迟双删 binlog）
  - https://xiaolincoding.com/redis/cluster/master_slave_replication.html#%E5%A6%82%E4%BD%95%E5%BA%94%E5%AF%B9%E4%B8%BB%E4%BB%8E%E6%95%B0%E6%8D%AE%E4%B8%8D%E4%B8%80%E8%87%B4
- redis 秒杀场景
  - https://xiaolincoding.com/cs_learn/feel_cs.html#%E9%AB%98%E5%B9%B6%E5%8F%91%E6%9E%B6%E6%9E%84%E7%9A%84%E8%AE%BE%E8%AE%A1
- Redis 这块，如果你作为一个 Redis 管理者，对使用有什么建议吗
- redis 的缓存双写一致性你如何保证
  - https://xiaolincoding.com/redis/architecture/mysql_redis_consistency.html
  - https://xiaolincoding.com/redis/base/redis_interview.html#redis-%E7%BC%93%E5%AD%98%E8%AE%BE%E8%AE%A1
- 选一个常用类型说一下底层实现
- redis 跳表、动态字符串
- redis 的过期时间 TTL，是谁来负责更新的？就比如过期时间是 100，是什么负责把它更新为 99 呢？
- redis 惊群效应
- redis 的内存回收
  - 内存淘汰策略共有八种，分为「不进行数据淘汰」和「进行数据淘汰」两类策略
    - 不进行数据淘汰的策略（noeviction）
    - 进行数据淘汰的策略，分为「在设置了过期时间的数据中进行淘汰」和「在所有数据范围内进行淘汰」这两类策略
      - 过期时间的数据中进行淘汰
        - volatile-random：随机淘汰设置了过期时间的任意键值
        - volatile-ttl：优先淘汰更早过期的键值
        - volatile-lru：淘汰所有设置了过期时间的键值中，最久未使用的键值
        - volatile-lfu：淘汰所有设置了过期时间的键值中，最少使用的键值
      - 在所有数据范围内进行淘汰
        - allkeys-random：随机淘汰任意键值
        - allkeys-lru：淘汰整个键值中最久未使用的键值
        - allkeys-lfu：淘汰整个键值中最少使用的键值
- redis 怎么知道这个 key 已经过期了（过期字典「惰性删除+定期删除」）
  - 被动过期 尝试去访问一个过期了的 key，此时这个 key 会被删除
  - 主动过期 https://redis.io/commands/expire/
    - Redis 会定期 *TODO_* 的在设置了过期时间的 key 中随机挑选测试一些 key，已过期的 key 删除
    - Redis 每秒会执行 10???? 次下面的步骤
      - 在设置了过期时间的 key 中随机挑选 20 个 key 测试
      - 删除所有已过期的 key
      - 如果有超过 25% 的 key 过期，重复第一步
        - 概率算法，假设样本代表整个 key space，Redis 继续过期直到可能过期的 key 百分比低于 25％
        - 在任意给定时刻，使用内存的已过期 key 的最大数量最大等于每秒最大写入操作数量除以 4。
- redis 的分布式锁你了解多少
  - 加锁包括了读取锁变量、检查锁变量值和设置锁变量值 SETNX
  - 锁变量需要设置过期时间
  - 锁变量的值需要能区分来自不同客户端的加锁操作
  - Redlock
- redis 持久化机制
  - AOF（AOF 重写机制、AOF 重写缓冲区、AOF 缓冲区、AOF 重写子进程）
  - RDB（save、bgsave）
- redis 缓存穿透、击穿和雪崩以及对应的解决方案
  - 穿透：数据既不在缓存中，也不在数据库中时有大量访问
    - 限制非法请求
    - 缓存空值或者默认值
    - 布隆过滤器 TODO
  - 击穿：热点数据过期
    - 不给热点数据设置过期时间，由后台异步更新缓存，或者在热点数据准备要过期前，提前通知后台线程更新缓存以及重新设置过期时间
    - 互斥锁方案，保证同一时间只有一个业务线程更新缓存，未能获取互斥锁的请求，要么等待锁释放后重新读取缓存，要么就返回空值或者默认值
  - 雪崩：大量缓存数据在同一时间过期（失效）或者 Redis 故障宕机，全部请求都直接访问数据库
    - 大量数据同时过期：均匀设置过期时间、互斥锁、双 key 策略、后台更新缓存（类似缓存预热）
    - Redis 故障宕机：服务熔断、请求限流、构建 Redis 集群
- redis 为什么更快，持久化方式，redis 单线程在多核机器里使用会不会浪费机器资源
  - 基于内存的数据库，对数据的读写操作都是在内存中完成，因此读写速度非常快
  - AOF 日志：每执行一条写操作命令，就把该命令以追加的方式写入到一个文件里；RDB 快照：将某一时刻的内存数据，以二进制的方式写入磁盘；混合持久化方式：Redis 4.0 新增的方式，集成了 AOF 和 RBD 的优点
  - CPU 并不是制约 Redis 性能表现的瓶颈所在，更多情况下是受到内存大小和网络I/O的限制
- string
- list
- set
- zset
- bitmap
- hyperloglog
- map