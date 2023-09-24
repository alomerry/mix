检查多个文件是否存在

 - stat:
        path: "{{ item }}"
      register: file_details
      loop:
        - info.text
        - info.html

    - debug:
        msg: The files exist
      when: file_details.results|map(attribute='stat.exists') is all


https://www.redhat.com/zh/topics/automation/learning-ansible-tutorial