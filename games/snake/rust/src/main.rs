use piston_window::{clear, rectangle, PistonWindow, WindowSettings};
use piston_window::types::Color;
use crate::draw::draw::to_coord;
use crate::game::game::Game;

mod game;
mod draw;

const BACK_COLOR: Color = [0.5, 0.5, 0.5, 1.0];

// https://www.cnblogs.com/SantiagoZhang/p/17286058.html
// https://tonydeng.github.io/2019/10/28/rust-mod/
fn main() {
    let (width, height) = (100, 80);
    let mut window: PistonWindow = WindowSettings::new("Snake", [to_coord(width) as u32, to_coord(height) as u32]).exit_on_esc(true).build().unwrap();

    let mut game = Game::new(width, height);

    while let Some(event) = window.next() {
        window.draw_2d(&event, |c, g, _| {
            clear(BACK_COLOR, g);
            game.draw(&c, g);
        });
    }
}
