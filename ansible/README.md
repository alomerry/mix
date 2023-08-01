ansible all -m ping -i ./ansible/hosts

ansible-playbook -i host/hosts playbook-all-roles.yml