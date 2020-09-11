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
struct Rectangle {
  left_top: Position,
  width: f64,
  height: f64,
}

#[derive(Debug)]
struct Circle {
  center: Position,
  radius: f64,
}

impl Circle {
  // オブジェクト自身に変更を加える必要がある場合は&mut selfとなる。
  fn area(&self) -> f64 {
    self.radius * self.radius * PI
  }
}

// 同じ構造体に関連するimplを複数記述することもできる。
impl Circle {
  fn get_unit(center: &Position) -> Circle {
    // 現在のCircleの定義では所有権のあるPositionを必要とする。
    // そのため引数のcenterをそのままCircleオブジェクト生成に使用する
    // ことはできない。そこでPositionオブジェクトを改めて生成している。
    // 防御的コピーのようなものか？
    Circle {
      center: Position {
        x: center.x,
        y: center.y,
      },
      radius: 1.0,
    }
  }
}

impl Rectangle {
  fn area(&self) -> f64 {
    self.width * self.height
  }

  // 中心座標は考慮していない。
  fn contains(&self, other: &Rectangle) -> bool {
    self.width > other.width && self.height > other.height
  }
}

fn main() {
  let center = Position { x: 10.0, y: 20.0 };
  let circle = Circle {
    center,
    radius: 10.5,
  };
  let rectangle1 = Rectangle {
    left_top: Position { x: 1.0, y: 4.5 },
    width: 40.5,
    height: 65.0,
  };

  println!("{:#?}", circle);
  println!("{:#?}", rectangle1);

  println!(
    "円の中心座標はx={},y={}です。\n円の面積は{}です。",
    circle.center.x,
    circle.center.y,
    circle.area()
  );

  println!("矩形の面積は{}です。", rectangle1.area());

  let rectangle2 = Rectangle {
    left_top: Position { x: 1.5, y: 7.0 },
    width: 10.1,
    height: 30.2,
  };

  println!(
    "矩形1は矩形2を含むか？{}",
    rectangle1.contains(&rectangle2)
  );
  println!(
    "矩形2は矩形1を含むか？{}",
    rectangle2.contains(&rectangle1)
  );

  println!("{:#?}", Circle::get_unit(&circle.center));
}
