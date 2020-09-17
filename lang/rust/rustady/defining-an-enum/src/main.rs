// 参考
// https://doc.rust-jp.rs/book/second-edition/ch06-01-defining-an-enum.html

#[derive(Debug)]
enum Subject {
    Chemistry(String),
    Math(String),
    Foreign(String, String)
}

#[derive(Debug)]
enum Command {
    Exit,
    Shot { x: i32, y: i32 },
    Name(String, String)
}

impl Command {
    fn dump(&self) {
        println!("{:#?}", self);
    }
}

fn gets(s: &str) -> String {
    String::from(s)
}

fn main() {
    let teacher1 = Subject::Chemistry(gets("Mike"));
    let teacher2 = Subject::Math(gets("Pola"));
    let teacher3 = Subject::Foreign(gets("Lee"), gets("English"));

    println!("{:#?},{:#?},{:#?}", teacher1, teacher2, teacher3);

    let mut command = Command::Shot { x: 10, y: 20 };
    command.dump();
    command = Command::Exit;
    command.dump();
    command = Command::Name(gets("Hoge"), gets("Fuga"));
    command.dump();

    let a = 12;
    let b: Option<i32> = Some(24);
    // nullを表現したい時はNoneを使う。Noneであっても型を明示する必要がある。
    let c: Option<String> = None;
    // 型が違うのでエラー。
    //let x = a + b;
    let x = a + b.unwrap();    
    println!("{:?},{:?},{:?},{}", a, b, c, x);
    // Noneをunwrapすると実行時エラーとなる。
    //println!("{}", c.unwrap());
    println!("{}", c.unwrap_or(gets("default value")));
}
