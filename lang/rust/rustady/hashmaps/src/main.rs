// 参考
// https://doc.rust-jp.rs/book-ja/ch08-03-hash-maps.html

use std::collections::HashMap;

fn main() {
    let mut members = HashMap::new();
    members.insert(1, "Mike");
    members.insert(2, "Peter");
    members.insert(3, "Ai");

    let numbers = vec![1,2,3];
    let names = vec!["Foo", "Bar", "Baz"];
    // 左辺の型注釈HashMap<_, _>は必須。_を使うなら推論できそうなものであるが。
    // zipが素直にHashMap型を返す仕様にしなかった理由はなんだろうか。
    let members2: HashMap<_, _> = numbers.iter().zip(names.iter()).collect();
    println!("{:#?}", members2);

    let name1 = String::from("Hoo");
    let score1 = 99;
    let mut scores1 = HashMap::new();
    // &を付けてinsertしないと借用規則に引っかかりコンパイルエラーになる。
    //scores1.insert(&name1, &score1);
    //println!("{}:{}", name1, score1);
    scores1.insert(name1, score1);
    dump_map(&scores1);
    scores1.insert(String::from("Hoo"), 87);
    dump_map(&scores1);
    // or_insertは存在しないとされる。
    //scores1.entry((String::from("Hoo")).or_insert(98);
    let mut dict = HashMap::new();
    for word in "Hello, world and go Rust and WebAssembly.".split_whitespace() {
        // or_insertでキーが存在しなければ値を挿入する。
        let count = dict.entry(word).or_insert(0);
        // *を付けて参照外ししないとコンパイルエラーになる。
        *count += 1;
    }
    println!("{:#?}", dict);
}

fn dump_map(scores: &HashMap<String, i64>) {
    for (name, score) in scores {
        println!("{}:{}", name, score);
    }
}
