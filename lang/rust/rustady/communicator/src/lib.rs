// 参考:
// https://doc.rust-jp.rs/book/second-edition/ch07-01-mod-and-the-filesystem.html

// 将来的にサブモジュールを作る可能性に備えて常にディレクトリを作成して
// その中にモジュールファイルを作成するべきなのか？

mod networking;

mod client;

#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        assert_eq!(2 + 2, 4);
    }
}
