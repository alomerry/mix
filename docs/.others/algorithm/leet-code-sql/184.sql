use how_mysql_work;
select Department.name as 'Department', Employee.name as 'Employee', Employee.salary as 'Salary'
from Employee,
     Department
where Employee.departmentId = Department.id
  and (Employee.departmentId, Employee.salary) in (select departmentId, max(salary)
                                                   from Employee
                                                   group by departmentId)