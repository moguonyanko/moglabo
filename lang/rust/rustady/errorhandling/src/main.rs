// 参考:
// https://doc.rust-jp.rs/book-ja/ch09-01-unrecoverable-errors-with-panic.html
// https://doc.rust-jp.rs/book-ja/ch09-02-recoverable-errors-with-result.html

use std::fs::File;
use std::io;
//use std::io::ErrorKind;
use std::io::Read;

fn read_sampletext_from_file() -> Result<String, io::Error> {
    // let file = File::open("sample.txt");
    
    // let mut file = match file {
    //     Ok(file) => file,
    //     Err(error) => return Err(error) 
    // };

    let mut sample_text = String::new();
    // read_to_string関数を使うにはuse std::io::Readが必要である。
    // なお以下は式なのでreturnを記述しなくても値が返されている。
    // match file.read_to_string(&mut sample_text) {
    //     Ok(_) => Ok(sample_text),
    //     Err(error) => Err(error)
    // }
    // ?演算子を使った記述で上のmatchと同じ意味になる。
    // file.read_to_string(&mut sample_text)?;
    // Ok(sample_text)

    // File::openでも?演算子を使った場合
    // 複雑なエラーハンドリングを必要としない場合に有用？
    // Resultは他言語のOptionalのようなものか。
    File::open("sample.txt")?.read_to_string(&mut sample_text)?;
    Ok(sample_text)    
}

fn main() {
    //panic!("Error");

    let v = vec!["Hey", "Yo", "Do"];
    //v[100];
    println!("{}", v[0]);

    // let file = File::open("sample.txt");
    // let file = match file {
    //     Ok(file) => file,
    //     Err(ref error) if error.kind() == ErrorKind::NotFound => { 
    //         match File::create("sample.txt") {
    //             Ok(file) => file,
    //             Err(error) => {
    //                 panic!("ファイル作成失敗: {:?}", error);
    //             }
    //         }
    //     },
    //     Err(error) => {
    //         panic!("ファイルオープン失敗: {:?}", error);
    //     }
    // };

    //let file = File::open("sample.txt").unwrap();
    // expectで自分が分かりやすいエラーメッセージを指定できる。
    //let file = File::open("sample.txt").expect("ファイルオープン失敗");

    let file = read_sampletext_from_file();
    println!("{:?}", file);
}
