// 参考:
// https://doc.rust-jp.rs/book/second-edition/ch03-01-variables-and-mutability.html

// 定数は型宣言必須。右辺は必ず分かっているので型推論は不要なはずということだろうか。
const SAMPLE_VALUE: u64 = 100_000_000;

fn main() {
    let mut a = 10;
    println!("a = {}", a);
    a = 2000;
    println!("a = {}", a);
    println!("sample value = {}", SAMPLE_VALUE);

    let value = "  HELLO  ";
    // letで同じ名前の変数を再度宣言している。
    // letが無ければ不変な変数を変更しようとしたものとしてエラーになる。
    let value = value.trim();
    println!("value = {}", value);
}
