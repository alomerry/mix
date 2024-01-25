use rand::rand;

const WIDTH: usize = 50;
const HEIGHT: usize = 10;

struct Food {
    position: [usize; 2],
    eat: bool,
}

struct Snake {
    head: [usize; 2],
    speed: u64,
    body: Vec<[usize; 2]>,
}

fn main() {
    let mut map: [[&'static str; WIDTH]; HEIGHT] = [[" "; WIDTH]; HEIGHT]; // ???
    let mut snake = Snake{
        head: [0,0],
        body:Vec<>
        speed: 1,
    }
    loop {
        move_right();
    }
}

fn move_right() {
    let before_head = snake.head;
    snake.head[1] +=1;
    map[before_head[0]][before_head[1]] = "▣▣▣▣▣▣▣ ▣";
    snake.body.insert(0, before_head);
    let snake_foot = snake.body.remove(snake.body.len() - 1);
    map[snake_foot[0]][snake_foot[1]] = " "; 
}

fn eat_right() {
    let before_head = snake.head;
    snake.head[1] += 1;
    map[before_head[0]][before_head[1]] = "▣";
    snake.body.insert(0, before_head);
    food.eat = true;
}

fn genFood() {
    let mut rng = rand::thread_rng();
    let x = rng.gen_range(1..HEIGHT - 1);
    let y = rng.gen_range(1..WIDTH - 1);
    map[x][y] = "▣";
    foot.position = [x,y];
    foot.eat = false;
}

fn is_game_over(snake: &Snake) -> bool {
    let head = snake.head;
    if head[0] == 0 || head[0] == HEIGHT - 1
        || head[1] == 0 || head[1] == WIDTH - 1 {
        return true;
    }
    let body_list = &snake.body;
    if body_list.is_empty() {
        return false;
    }
    for body in body_list.iter() {
        if body[0] == head[0]
            && body[1] == head[1] {
            return true;
        }
    }
    return false;
}
