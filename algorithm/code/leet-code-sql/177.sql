CREATE FUNCTION getNthHighestSalary(N INT) RETURNS INT
BEGIN
set N = N - 1;
  RETURN (
      select ifnull((select distinct Salary from Employee group by Salary order by Salary desc limit 1 offset N), null) as getNthHighestSalary
  );
END
