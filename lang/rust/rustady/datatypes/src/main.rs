// 参考:
// https://doc.rust-jp.rs/book/second-edition/ch03-02-data-types.html

fn main() {
    // 左辺の型注釈はなくてもいい。
    let tuple:(i64, f64, u32) = (100, 5.5, 1);
    let (a, b, c) = tuple;
    println!("a={}, b={}, c={}", a, b, c);
    println!("a={}, b={}, c={}", tuple.0, tuple.1, tuple.2);

    // 型の混在は許容されない。
    //let array = [1, 2, 'a'];
    let array = ['a', '🌻', 'Σ'];
    // 配列のサイズを超えたアクセスは「コンパイルエラー」になる。
    //let x = array[4];
    let (x, y, z) = (array[0], array[1], array[2]);
    println!("x={}, y={}, z={}", x, y, z);
}
