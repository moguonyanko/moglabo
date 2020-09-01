//extern crate rand; // コメントアウトしても一切エラーにならない。

use rand::Rng;
use std::cmp::Ordering;
use std::io;

// 参考:
// https://doc.rust-jp.rs/book/second-edition/ch02-00-guessing-game-tutorial.html
fn main() {
    println!("数当てゲーム");

    let min = 1;
    let max = 51;
    let secret_num = rand::thread_rng().gen_range(min, max);

    // println!(
    //     "秘密の数字({}から{}まで): {}",
    //     min, max, secret_num
    // );

    loop {
        // 可変にしたければmutを指定する。デフォルトは不変。
        let mut guess = String::new();

        // 参照もデフォルトで不変なので&mutを付けて可変にする。
        io::stdin()
            .read_line(&mut guess)
            // expectメソッドを呼び出してResultオブジェクトの処理を行っていないと
            // コンパイラから警告される。軽いチェック例外のようなものか。
            .expect("行の読み込み失敗！");

        // mutを付けると可変である必要がないとして警告される。
        // 変数のシャドーイングは許容される。今回のように全く同じ対象を指す時以外は
        // 用いるべきではない。
        // trimは空白だけでなく入力文字列の改行も除去する。
        let guess: u64 = match guess.trim().parse() {
            Ok(num) => num,
            Err(_) => continue,
        };

        println!("あなたの予想: {}", guess);

        match guess.cmp(&secret_num) {
            Ordering::Less => println!("小さすぎ"),
            Ordering::Greater => println!("大きすぎ"),
            Ordering::Equal => {
                println!("当たり！");
                break;
            }
        }
    }
}
