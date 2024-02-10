# 创建数据库

```sql
CREATE DATABASE `umami` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
CREATE USER umami IDENTIFIED BY 'password';
grant all privileges on umami.* to 'umami'@'%';
FLUSH PRIVILEGES;
```


CREATE USER umami IDENTIFIED BY 'JdsVEewaa23IF8u8qFDS1';

ALTER USER 'umami'@'localhost' IDENTIFIED WITH mysql_native_password BY 'JdsVEewaa23IF8u8qFDS1';

