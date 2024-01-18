use piston_window::types::Color;
use piston_window::{rectangle, Context, G2d};

const BLOCK_SIZE: f64 = 10.0;

pub fn to_coord(game_coord: i32) -> f64 {
    (game_coord as f64) * BLOCK_SIZE
}

pub fn draw_rectangle(color: Color, x: i32, y: i32, width: i32, height: i32, con: &Context,
                      g: &mut G2d) {
    let gui_x = to_coord(x);
    let gui_y = to_coord(y);
    let width = to_coord(width);
    let height = to_coord(height);
    rectangle(color, [gui_x, gui_y, width, height], con.transform, g);
}