// 参考:
// https://doc.rust-jp.rs/book/second-edition/ch04-03-slices.html

// &を付けて引数を宣言する＝所有権を必要としない
fn second_text(s: &str) -> &str {
    let bytes = s.as_bytes();

    for (i, &item) in bytes.iter().enumerate() {
        if item == b' ' {
            return &s[(i + 1)..bytes.len()];
        }
    }

    // 空白が見つからなかった時は文字列全体を返す。
    &s[..]
}

fn main() {
    let s = String::from("おはよう");
    let size = s.len();
    // マルチバイト文字の文字境界で分割されないと実行時エラーになる。
    let s0 = &s[0..size / 2];
    let s1 = &s[size / 2..size];
    println!("{}:{}", s0, s1);

    let /*mut*/ s2 = String::from("I am Mike");
    let text1 = second_text(&s2);
    // s2は可変であるがsecond_word関数は「不変」の引数を借用する。
    // 従ってその後s2を変更することは不可能になりコンパイルエラーとなる。
    // second_wordを「可変」の引数を借用するように変更しsecond_word関数に
    // &s2として渡すようにしても今度は複数回可変の変数を借用できないエラーになる。
    // 面倒な思いをしたくなければ不用意に状態を変更するコードを書くなということか。
    // 状態を変更するコードを書かなければそもそもmutで宣言する必要がない。
    //s2.clear();
    // cloneはmutが指定されていなくても可能。
    //s2.clone().clear();
    println!("Second word is [{}]", text1);

    let text2 = second_text(&s2[..]);
    println!("Second word is [{}]", text2);

    let text3 = second_text("My Rust");
    println!("Second word is [{}]", text3);

    let a = [100, 99, 98, 97, 96];
    let sub_num = &a[1..4];
    for num in sub_num {
        println!("{}", num);
    }
}
