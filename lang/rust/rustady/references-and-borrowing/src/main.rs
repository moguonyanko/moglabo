// 参考:
// https://doc.rust-jp.rs/book/second-edition/ch04-02-references-and-borrowing.html

fn add_str(base: &mut String, s: &str) {
    base.push_str(s);
}

fn main() {
    let mut s = String::from("Hello,");
    let a = "World";
    // 所有権をmoveせずにその後も同じ変数を使用するには&を付けて参照として関数に渡す。
    // aの&はなくても同じ結果になる。
    add_str(&mut s, &a);
    println!("{}, Appended word => {}", s, a);

    let r1 = &mut s;
    // 同一スコープ同一変数に対し可変な参照を2つ以上生成することはできない。
    // 参照を利用して何らかの処理をしていなければコンパイルエラーにはならない。
    //let r2 = &mut s;
    // 同一スコープで既にsに対し可変な参照を作られているので不変な参照であっても
    // 新規に生成することはできない。cloneでもダメ。
    //let r2 = &s;
    //let r2 = s.clone();
    // 可変な参照が作られていない変数に対して不変な参照は複数回作成できる。
    let r2 = &a;
    println!("r1={}, r2={}", r1, r2);
}
