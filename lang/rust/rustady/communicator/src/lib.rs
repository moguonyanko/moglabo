// 参考:
// https://doc.rust-jp.rs/book/second-edition/ch07-01-mod-and-the-filesystem.html

// 将来的にサブモジュールを作る可能性に備えて常にディレクトリを作成して
// その中にモジュールファイルを作成するべきなのか？

pub mod networking;

pub mod client;

pub mod outside {
    pub fn outer_pub() {}
    
    pub fn outer() {}

    pub mod inside {
        pub fn inner_pub() {}

        pub fn inner() {}
    }
}

pub fn check() {
    outside::outer_pub();
    // pubでないかつトップレベルでない関数やモジュールへのアクセスはエラー
    outside::outer();
    outside::inside::inner_pub();
    outside::inside::inner();
}

#[cfg(test)]
mod tests {
    // ここはtestsモジュールのスコープになっているので改めてclientモジュールの
    // 宣言が必要なのは理解できるが面倒だし自然な書き方に思えない。
    use super::client;

    #[test]
    fn it_works() {
        client::do_connect();
    }
}
