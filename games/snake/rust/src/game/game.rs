use crate::draw::draw::draw_rectangle;
use piston_window::types::{Color, Width};
use piston_window::{Context, G2d};

const T_BORDER_COLOR: Color = [0.0000, 0.5, 0.5, 0.6];
const B_BORDER_COLOR: Color = [0.0000, 0.5, 0.5, 0.6];
const L_BORDER_COLOR: Color = [0.0000, 0.5, 0.5, 0.6];
const R_BORDER_COLOR: Color = [0.0000, 0.5, 0.5, 0.6];

#[derive(Debug)]
pub struct Game {
    width: i32,
    height: i32,
}

impl Game {
    pub fn new(width: i32, height: i32) -> Game {
        Game {
            width,
            height,
        }
    }
    pub fn draw(&self, con: &Context, g: &mut G2d) {
        draw_rectangle(T_BORDER_COLOR, 0, 0, self.width, 1, con, g);
        draw_rectangle(B_BORDER_COLOR, 0, self.height - 1, self.width, 1, con, g);
        draw_rectangle(L_BORDER_COLOR, 0, 0, 1, self.height, con, g);
        draw_rectangle(R_BORDER_COLOR, self.width - 1, 0, 1, self.height, con, g);
    }
}
