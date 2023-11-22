# 最佳实践

- 拥有版本控制
- 拥有可重复性
- 从基本的 playbook 目录结构和静态的主机清单来构建 roles
- 后续可以自己开发模块和插件

ansible-playbook -i host/cloud playbook/cloud/nginx.yml 