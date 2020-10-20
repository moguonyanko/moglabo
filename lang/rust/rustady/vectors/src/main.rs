// 参考:
// https://doc.rust-jp.rs/book-ja/ch08-01-vectors.html

#[derive(Debug)]
enum Cell {
    Int(i64),
    Float(f64),
    Info(String)
}

fn main() {
    let v = vec!["A", "B", "C"];
    println!("{:#?}", v);

    let mut v2 = vec![1, 2, 3, 4, 5];
    v2.push(100);
    v2.push(200);
    v2.push(300);
    println!("{:#?}", v2);

    {
        // 1番目の要素でベクタの型が推論される。そのため右辺を vec!["A", 1]; とすると
        // コンパイルエラーになる。
        let v3 = vec!["A", "1"];
        println!("{:#?}", v3);
    }
    // ブロックを抜ければベクタは破棄される。ここではv3が破棄される。

    let v4 = vec![100, 200, 300];
    // getではOption型が返される。存在しない要素を参照してもNoneが返るだけでエラーにはならない。
    let ele2 = v4.get(1);
    let ele100 = v4.get(99);
    println!("{:#?},{:#?}", ele2, ele100);

    let mut v5 = vec![5, 4, 3, 2, 1];
    v5.push(555);
    v5.pop();
    let ele5 = v5.get(4);
    // 読み込み(get)の後にベクタに変更を加えると借用規則違反によりエラーになる。
    // 「読んだら書くな」ということである。
    //v5.push(555);
    println!("{:#?}", ele5);

    for e in &mut v5 {
        *e *= 10;
    }
    println!("{:#?}", v5);

    // 異なる型の要素はenumでラップすることで同じベクタに含めることができる。
    let v6 = vec![
        Cell::Int(36),
        Cell::Float(1.5),
        Cell::Info(String::from("おはようございます"))
    ];
    println!("{:#?}", v6);
}
