// 参考:
// https://doc.rust-jp.rs/book/second-edition/ch05-02-example-structs.html

use std::f64::consts::PI;

// PositionにもDebugトレイトのアノテーションが指定されていないと
// Circle側でエラーになる。
#[derive(Debug)]
struct Position {
  x: f64,
  y: f64,
}

#[derive(Debug)]
struct Circle {
  center: Position,
  radius: f64,
}

fn get_circle_area(circle: &Circle) -> f64 {
  circle.radius * circle.radius * PI
}

fn main() {
  let center = Position { x: 10.0, y: 20.0 };
  let circle = Circle {
    center,
    radius: 10.5,
  };

  println!("{:#?}", circle);

  println!(
    "円の中心座標はx={},y={}です。\n円の面積は{}です。",
    circle.center.x,
    circle.center.y,
    get_circle_area(&circle)
  );
}
