// 参考:
// https://doc.rust-jp.rs/book/second-edition/ch05-01-defining-structs.html

struct Student {
    // ライフタイムを使わなければ所有権のないフィールドを定義することはできない。
    //name: &str,
    name: String,
    age: u32
}

struct Position(i64, i64);

struct Code(i64, i64, i64);

fn main() {
    let s1 = Student { 
        name: String::from("Mike"),
        age: 16
    };
    let mut s2 = Student {
        ..s1
    };
    s2.name = String::from("Joe");
    println!("{},{}", s2.name, s2.age);

    let p1 = Position(10, 20);
    let n1 = Code(1, 2, 3);
    let mut p2 = p1;
    // 型が異なるので代入不可。
    //p2 = n1;
    p2 = Position(p2.0, 1);
    println!("{},{}", n1.0, p2.0);
}
