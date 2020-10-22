// 参考:
// https://doc.rust-jp.rs/book-ja/ch08-02-strings.html

fn main() {
    let mut s = String::from("こんにちは");
    let s2 = "おはよう";
    s.push_str(s2);
    println!("{}", s2);

    let s3 = String::from("こんばんわ");
    let s4 = format!("{}!!{}!!{}!!!", s, s2, s3);
    // s4[0]のように添字で文字列の文字を参照することはできない。
    println!("{}", s4);
}
