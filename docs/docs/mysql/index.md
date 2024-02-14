# MySQL8 手册

## 修改密码

mysql> show databases;

mysql> use mysql;

mysql> ALTER USER '用户名'@'localhost' IDENTIFIED WITH mysql_native_password BY '新密码';

mysql> flush privileges;   --刷新MySQL的系统权限相关表

mysql> exit;

[MySQL8.0、创建新用户与角色授权](https://cloud.tencent.com/developer/article/2230081)