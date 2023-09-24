---
date: 2023-08-20
timeline: false
article: false
category:
  - Database
tag:
  - MySQL
---

# mysql

## KB

执行一条 SQL 查询语句，期间发生了什么？

::: details

![MySQL 执行流程](https://cdn.alomerry.com/blog/assets/img/notes/database/mysql/mysql-query.webp)

- 连接器：建立连接，管理连接、校验用户身份；
- 查询缓存：查询语句如果命中查询缓存则直接返回，否则继续往下执行。MySQL 8.0 已删除该模块；
- 解析 SQL：通过解析器对 SQL 查询语句进行词法分析、语法分析，然后构建语法树，方便后续模块读取表名、字段、语句类型；
- 执行 SQL
  - 预处理阶段：检查表或字段是否存在；将 select * 中的 * 符号扩展为表上的所有列。
  - 优化阶段：基于查询成本的考虑， 选择查询成本最小的执行计划；
  - 执行阶段：根据执行计划执行 SQL 查询语句，从存储引擎读取记录，返回给客户端；

:::

MySQL 一行记录是怎么存储的？

::: details

表空间由段（segment）、区（extent）、页（page）、行（row）组成，InnoDB存储引擎的逻辑存储结构大致如下图：

![表结构](https://cdn.alomerry.com/blog/assets/img/notes/database/mysql/table-struct.webp)

- 行：数据库表中的记录都是按行（row）进行存放的，每行记录根据不同的行格式，有不同的存储结构
- 页：记录是按照行来存储的，但是数据库的读取并不以「行」为单位，否则一次读取（也就是一次 I/O 操作）只能处理一行数据，效率会非常低。因此，InnoDB 的数据是按「页」为单位来读写的，也就是说，当需要读一条记录的时候，并不是将这个行记录从磁盘读出来，而是以页为单位，将其整体读入内存。
- 区：我们知道 InnoDB 存储引擎是用 B+ 树来组织数据的。B+ 树中每一层都是通过双向链表连接起来的，如果是以页为单位来分配存储空间，那么链表中相邻的两个页之间的物理位置并不是连续的，可能离得非常远，那么磁盘查询时就会有大量的随机I/O，随机 I/O 是非常慢的。解决这个问题也很简单，就是让链表中相邻的页的物理位置也相邻，这样就可以使用顺序 I/O 了，那么在范围查询（扫描叶子节点）的时候性能就会很高。**在表中数据量大的时候，为某个索引分配空间的时候就不再按照页为单位分配了，而是按照区（extent）为单位分配。每个区的大小为 1MB，对于 16KB 的页来说，连续的 64 个页会被划为一个区，这样就使得链表中相邻的页的物理位置也相邻，就能使用顺序 I/O 了。**
- 段：表空间是由各个段（segment）组成的，段是由多个区（extent）组成的。段一般分为数据段、索引段和回滚段等。
  - 索引段：存放 B + 树的非叶子节点的区的集合；
  - 数据段：存放 B + 树的叶子节点的区的集合；
  - 回滚段：存放的是回滚数据的区的集合，之前讲事务隔离 (opens new window)的时候就介绍到了 MVCC 利用了回滚段实现了多版本查询数据。

行格式，就是一条记录的存储结构。

InnoDB 提供了 4 种行格式，分别是 Redundant、Compact、Dynamic和 Compressed 行格式。



:::

COMPACT 行格式长什么样？

::: details

![compat 行格式](https://cdn.alomerry.com/blog/assets/img/notes/database/mysql/COMPACT-row-format.webp)

可以看到，一条完整的记录分为「记录的额外信息」和「记录的真实数据」两个部分。

记录的额外信息包含 3 个部分：变长字段长度列表、NULL 值列表、记录头信息。

:::

行溢出后，MySQL 是怎么处理的？

从数据页的角度看 B+ 树 https://xiaolincoding.com/mysql/index/page.html
为什么 MySQL 采用 B+ 树作为索引？
MySQL 单表不要超过 2000W 行，靠谱吗？
索引失效有哪些？
MySQL 使用 like “%x“，索引一定会失效吗？
count(*) 和 count(1) 有什么区别？哪个性能最好？
事务隔离级别是怎么实现的？
MySQL 可重复读隔离级别，完全解决幻读了吗？
MySQL 有哪些锁？
MySQL 是怎么加锁的？
update 没加索引会锁全表?
MySQL 记录锁+间隙锁可以防止删除操作而导致的幻读吗？
MySQL 死锁了，怎么办？
字节面试：加了什么锁，导致死锁的？
undo log、redo log、binlog 有什么用？
揭开 Buffer_Pool 的面纱

## grammar

- create database xxx
- show databases
- use database

### 插入

insert into 表名 (column_name1, column_name2, ...) values (value1, value2, ...)

### 查询

select[distinct][concat (col1,":",col2) as col] selection_list // 选择的列 from 数据表名 where primary_constraint // 查询条件 group by grouping_cols // 分组 order by sorting_cols // 排序 having secondary_constraint // 查询的第二条件 limit count

#### where

- =
- >=
- <=
- >
- <
- != 或者 <>
- IS NULL
- IS NOT NULL
- BETWEEN AND
- IN
- NOT IN
- LIKE % _
- NOT LIKE
- REGEXP

### update

update 表名 set col_name1=new_value1, col_name2=new_value2, ... where condition

### delete

### 函数

- SUM
- AVG

## niuke



## Reference

- [图解MySQL介绍](https://xiaolincoding.com/mysql/)


ALTER USER 'root'@'localhost' IDENTIFIED WITH 'mysql_native_password' BY 'your_password';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY 'your_password';
FLUSH PRIVILEGES;
