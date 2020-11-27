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
}

impl Member for Employee {
    fn description(&self) -> String {
        format!("{},現在の給与は{}", self.id, self.sarary)
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
    let employee = Employee { 
        id: String::from("A001"), sarary: 100000 
    };
    println!("{}:{}", employee.name(), employee.description());
}
