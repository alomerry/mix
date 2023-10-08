select score, dense_rank() over w as 'rank'
from Scores
window w as (order by score desc);