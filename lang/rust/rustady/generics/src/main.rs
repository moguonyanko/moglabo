// 参考
// https://doc.rust-jp.rs/book-ja/ch10-00-generics.html
// https://doc.rust-jp.rs/book-ja/ch10-01-syntax.html

fn smallest<T: PartialOrd + Copy>(list: &[T]) -> T {
    let mut current = list[0];

    for &item in list.iter() {
        if item < current {
            current = item;
        }
    }

    current
}

#[derive(Debug)]
struct Point<T> {
    x: T,
    y: T,
}

impl <T> Point<T> {
    fn get_x(&self) -> &T {
        &self.x
    }
    fn get_y(&self) -> &T {
        &self.y
    }
}

impl Point<f64> {
    fn distance_from_origin(&self) -> f64 {
        (self.get_x().powi(2) + self.get_y().powi(2)).sqrt()
    }
}

// traitには指定できない。
//#[derive(Debug)]
trait Member {
    fn description(&self) -> String;

    fn name(&self) -> String {
        String::from("非表示")
    } 
}

trait Driver {
    fn get_drive_time(&self) -> i32;
}

#[derive(Debug)]
struct Student {
    name: String,
    no: i32,
    score: i32,
}

impl Member for Student {
    fn description(&self) -> String {
        format!("名前は{}、学生番号は{}、点数は{}", self.name, self.no, self.score)
    }

    // デフォルト実装
    // こちらは構造体で実装されなくてもコンパイルエラーにならない。
    fn name(&self) -> String {
        self.name.to_string()
    }
}

#[derive(Debug)]
struct Employee {
    id: String,
    sarary: i64,
    drive_time: i32,
}

impl Member for Employee {
    fn description(&self) -> String {
        format!("{},現在の給与は{}", self.id, self.sarary)
    }
}

impl Driver for Employee {
    fn get_drive_time(&self) -> i32 {
        self.drive_time
    }
}

// 引数は&impl Memberとも書ける。Memberがtraitであるかどうかも使う側には
// 意識させたくないので&implは使いたくない。
fn desc(target: &Member) {
    println!("DESCRIPTION:{}", target.description());
}

fn desc2<T: Member>(target: &T) {
    println!("DESCRIPTION2:{}", target.description());
}

fn desc3<T: Member + Driver>(target: &T) {
    println!("[{}]の運転時間は{}分", target.name(), target.get_drive_time());
}

// 型変数が増えて煩雑になる場合はwhereを使って整理できる。
// しかしwhereを使ってもさほど読みやすくなっているとは思えない。
// より多数かつ複雑な組み合わせの型変数を定義すれば有用性が分かるのかもしれない。
fn desc4<T, U>(m1: &T, m2: &U) where T: Member + Driver, U: Member {
    println!("[{}]が[{}]を{}分で送迎した。", m1.name(), m2.name(), 
        m1.get_drive_time());
}

// traitを指定する際にいちいちimplを書かせる仕様は間違っている。
// 対象の抽象性を使う側に意識させるべきではない。
// そして複数の具象的な型を返す関数は書けない。
// すなわち以下のように多態性を利用したコードはコンパイルエラーとなる。
// fn create_member(t: String) -> impl Member {
//     if t == "1" {
//         Employee {
//             id: String::from("A000"), 
//             sarary: 20000,
//             drive_time: 0
//         }
//     } else {
//         Student {
//             name: String::from("NO NAME"), 
//             no: -1, 
//             score: 0 
//         }
//     }
// }

trait Append {
    fn appended_name(&self) -> String;
}

// Memberを実装しているオブジェクトに限定してAppendを実装する。
impl<T: Member> Append for T {
    fn appended_name(&self) -> String {
        self.name() + "!!!!!"
    }
}

fn main() {
    let list = vec![10, 8, 30, 2, 43];
    let result = smallest(&list);
    println!("Smallest number = {}", result);

    let list = ['A', 'a', 'X', 'u', 'p'];
    let result = smallest(&list);
    println!("Smallest charactor = {}", result);

    // 型がどちらもTでないとコンパイルエラーになる。
    // let p1 = Point { x: 1.5, y: 1 };
    // Tがf64ではないのでPoint<f64>に実装したメソッドを呼び出せない。
    // let p1 = Point { x: 1, y: 1 };
    let p1 = Point { x: 1.2, y: 1.5 };
    println!("{:?}", p1);
    println!("原点からの距離 = {}", p1.distance_from_origin());

    let student = Student { 
        name: String::from("Masao"), no: 1, score: 80 
    };
    println!("{}", student.name());
    println!("{}", student.description());
    desc(&student);
    let employee = Employee { 
        id: String::from("A001"), 
        sarary: 100000,
        drive_time: 60
    };
    println!("{}:{}", employee.name(), employee.description());
    desc2(&employee);
    desc3(&employee);
    // Memberしか実装していないStudentは渡すことができない。
    //desc3(&student);
    desc4(&employee, &student);
    println!("{}", student.appended_name());
}
