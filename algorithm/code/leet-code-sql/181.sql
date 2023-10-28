select name as Employee
from Employee as man, Employee as boss
where man.managerId = boss.id and man.managerId
  and man.salary > boss.salary;