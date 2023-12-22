#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Time    : 2020年01月10日16:39:09
# @Author  : biglittle
# @Contact : biglittleant@hotmail.com
# @Site    :
# @File    : myshell.py
# @Software: PyCharm
# @Desc    : python file
# @license : Copyright(C), Your Company
from ansible.module_utils.basic import AnsibleModule
import commands


def main():
    """
    run shell
    """
    changed = False
    module = AnsibleModule(
                argument_spec = dict(
                 cmd = dict(type='str', required=True),
                ),
    )
    cmd = module.params['cmd']

    code,output = commands.getstatusoutput(cmd)
    if code == 0:
        # 按照ansible 的返回格式定义返回内容,stdout为标准输出,changed代表系统有没有东西被变更,rc=0代表执行成功
        result = dict(stdout=output,changed=changed,rc=0)
        # 使用ansible规则的module实例下的exit_json返回正常内容
        module.exit_json(**result)
    else:
        # 当调用失败返回错误信息的时候,数据字典只要传递msg信息就可了,然后调用module实例的fail_json方法给返回
        result = dict(msg=output,rc=code)
        module.fail_json(**result)


if __name__ == '__main__':

    main()
