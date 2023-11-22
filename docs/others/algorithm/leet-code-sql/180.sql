select distinct num as ConsecutiveNums
from (select num,
             lag(num, 1, null) over (order by id) as pre,
             lead(num, 1, null) over (order by id)
                                                  as next
      from Logs) as log
where log.num = log.pre
  and log.next = log.pre