// 参考:
// https://doc.rust-jp.rs/book/second-edition/ch04-01-what-is-ownership.html

fn dump_string(s: String) {
    println!("{}", s);
}

fn dumped_string(s: String) -> String {
    println!("{}", s);
    s
}

fn main() {
    let mut s1 = String::from("おはよう");
    s1.push_str("こんにちは");

    // s1はs2に「move」される。
    let mut s2 = s1;
    s2.push_str("こんばんわ");

    // 「move」されたs1は最早無効なのでコンパイルエラーとなる。
    // 同じ内容を指す複数の変数が一度にメモリ解放の対象になることはない。
    //println!("{}", s1);
    println!("{}", s2);

    // cloneは「move」ではない。従ってs2は引き続き有効である。
    let s3 = s2.clone();
    println!("{}:{}", s2, s3);

    // スカラー値(基本データ型のようなもの？)及びスカラー値だけで
    // 構成されるタプルは全てCopyトレイトに適合する。即ちスタックの
    // データがコピーされる(「move」が発生しない)。従ってコピー元の
    // 変数は引き続き有効なままである。
    let i = 100;
    let j = i;
    println!("i={},j={}", i, j);
    let t1 = ('I', '私');
    let t2 = t1;
    println!("{}={},{}={}", t1.0, t1.1, t2.0, t2.1);

    let m1 = String::from("文字列参照テスト");
    dump_string(m1);
    // 関数の引数に渡した時点でmoveされるのでm1は無効となっている。
    // 渡した先の関数でメモリ解放されてしまっている。
    // そのため関数呼び出し以降では変数が無効となっておりコンパイルエラーとなる。
    //println!("{}", m1);

    let m2 = String::from("文字列参照テストその2");
    // 戻り値のある関数を呼び出しても変数(ここではm2)の所有権を
    // 失うことに変わりはない。m2は呼び出し後無効である。
    let m3 = dumped_string(m2);
    println!("m3={}", m3);
}
