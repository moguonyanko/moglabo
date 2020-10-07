// 参考:
// https://doc.rust-jp.rs/book/second-edition/ch07-01-mod-and-the-filesystem.html

// 将来的にサブモジュールを作る可能性に備えて常にディレクトリを作成して
// その中にモジュールファイルを作成するべきなのか？

pub mod networking;

pub mod client;

mod outside {
    pub fn outer_pub() {}
    
    fn outer() {}

    mod inside {
        pub fn inner_pub() {}

        fn inner() {}
    }
}

fn check() {
    outside::outer_pub();
    // pubでないかつトップレベルでない関数やモジュールへのアクセスはエラー
    //outside::outer();
    //outside::inside::inner_pub();
    //outside::inside::inner();
}
