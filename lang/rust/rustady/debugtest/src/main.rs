use std::env;

fn main() {
    // プログラムの最初の方に追加
    match env::current_dir() {
        Ok(path) => println!("プログラムの現在の作業ディレクトリ: {:?}", path),
        Err(e) => println!("現在の作業ディレクトリの取得に失敗: {}", e),
    }    
    println!("Debug test");
}
