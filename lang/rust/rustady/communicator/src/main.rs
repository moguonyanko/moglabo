// 参考:
// https://doc.rust-jp.rs/book/second-edition/ch07-03-importing-names-with-use.html

extern crate communicator;

use communicator::client;

#[derive(Debug)]
enum Direction {
  Left,
  Right,
  Top,
  Bottom
}

// useによる名前空間のスコープへの導入はenumに対しても使える。
use Direction::{Left, Right};

fn main() {
  // clientモジュールが公開されていなければこのmain.rsのように
  // モジュール内部にあるファイルからのアクセスであってもエラーになる。
  client::do_connect();

  let left = Left;
  let right = Right;
  println!("{:#?},{:#?}", left, right);
  // スコープに導入されていない値はenumの名称からアクセスするしかない。
  let top = Direction::Top;
  let bottom = Direction::Bottom;
  println!("{:#?},{:#?}", top, bottom);
}
