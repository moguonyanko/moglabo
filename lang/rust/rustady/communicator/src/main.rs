extern crate communicator;

fn main() {
  // clientモジュールが公開されていなければこのmain.rsのように
  // モジュール内部にあるファイルからのアクセスであってもエラーになる。
  communicator::client::do_connect();
}
