
## create db

```sql
create database <db_name>;
create user '<user_name>'@'%' identified by '<db_passwd>';
grant all on <db_name>.* to '<user_name>'@'%' with grant option;
flush privileges;
```

- umami
- study

## TOODO backup dbs

## Reference

- https://blog.csdn.net/qq_35866846/article/details/105763502

