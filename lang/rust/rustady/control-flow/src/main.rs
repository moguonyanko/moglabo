// 参考:
// https://doc.rust-jp.rs/book/second-edition/ch03-05-control-flow.html

// メモ化していないため遅い。
fn fib(x: i32) -> i32 {
    if x == 0 {
        0
    } else if x == 1 {
        1
    } else {
        fib(x - 1) + fib(x - 2)
    }
}

fn sample_loop() {
    let array = ['H', 'E', 'L', 'L', 'O'];
    // 配列をそのまま反復することはできない。
    for s in array.iter() {
        print!("{}", s);
    }

    println!("\n");

    // 1..11の右辺の値は範囲に含まれない。
    for n in (1..11).rev() {
        print!("{}", n);
    }
    println!("GO!");
}

fn main() {
    let greet = "Hello";

    let result = if greet.len() > 0 {
        // 最初の指揮で返される値の型が優先される。
        "Hey!"
    } else {
        // たとえばここで1とすると文字型ではないためコンパイルエラーになる。
        ""   
    };

    println!("{}", result);

    sample_loop();

    let x = 10;
    let n = fib(x);
    println!("Fibonacci sequence {} = {}", x, n);
}
