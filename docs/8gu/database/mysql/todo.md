
## create db

```sql
use mysql;
create database <db_name>;
create user '<user_name>'@'%' identified by '<db_passwd>';
grant all on <db_name>.* to '<user_name>'@'%' with grant option;
flush privileges;
```

- umami
- study
- chorus_player chorus_player_root

## TOODO backup dbs

## Reference

- https://blog.csdn.net/qq_35866846/article/details/105763502



gorm

https://gorm.io/zh_CN/docs/conventions.html

goredis

https://redis.uptrace.dev/zh/guide/

https://search.yibook.org/
