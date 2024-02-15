# 创建数据库

```sql
CREATE DATABASE `umami` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;
CREATE USER umami IDENTIFIED BY 'password';
ALTER USER 'umami'@'%' IDENTIFIED WITH mysql_native_password BY 'password';
grant all privileges on umami.* to 'umami'@'%';
FLUSH PRIVILEGES;
```
