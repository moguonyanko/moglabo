// 参考:
// https://doc.rust-jp.rs/book/second-edition/ch03-03-how-functions-work.html

// 関数はデフォルトでは空のタプルを返す。
fn nothing() {
    // セミコロンを外すと式となり1が戻り値となる。
    // この関数では戻り値の型を整数型として指定しないため
    // コンパイルエラーとなる。
    1;
}

fn add(x: i32, y: i32) -> i32 {
    x + y
}

fn main() {
    // 以下はエラー。letは値を返さないのでaに値を束縛できない。
    //let a = (let b = 100);

    // このbは使用されない。以下のより小さなスコープのbが使用される。
    //let b = -1;

    let a = {
        let b = 100;
        // セミコロンをつけると文になる。文は値を返さないので
        // ここでセミコロンをつけるとaに束縛する値がなくなり
        // コンパイルエラーとなる。
        b * 2
    };

    println!("a = {}", a);

    nothing();

    let x = 19; 
    let y = 11;
    println!("{} + {} = {}", x, y, add(x, y));
}
