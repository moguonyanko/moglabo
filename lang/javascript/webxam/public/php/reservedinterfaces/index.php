<?php

declare(strict_types=1);
?>
<!DOCTYPE html>
<html lang="ja">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>定義済みのインターフェイスとクラス</title>
  <link rel="stylesheet" href="../../common.css" />
</head>

<body>
  <header>
    <a href="../../">home</a>
    <h1>定義済みのインターフェイスとクラス</h1>
  </header>

  <main>
    <section>
      <h2>Stringable</h2>
      <?php 
      class MyMember implements Stringable {
        function __construct(readonly string $name) {}

        function __toString(): string {
          return $this->name;
        }
      }

      echo '<p>', new MyMember('Taro'), '</p>';
      ?>
    </section>
    <section>
      <h2>WeakMap</h2>
      <p>キーを示す変数がunsetされた時点でキーに関連づけられた値も破棄される。</p>
      <?php 
      $samplemap = new WeakMap;

      class MyKey {
        function __destruct() {
          echo 'My key is destructed<br />';
        }
      }

      class MyValue {
        function __destruct() {
          echo  'My value is destructed<br />';
        }
      }

      $mykey = new MyKey;

      $samplemap[$mykey] = new MyValue;

      echo var_dump(count($samplemap)), '<br />';
      echo 'Try unset --------------------<br />';
      unset($mykey);
      echo 'Done unset --------------------<br />';
      echo var_dump(count($samplemap)), '<br />';
      ?>
    </section>
    <section>
      <h2>Iterator</h2>
      <?php 
      // 配列のキーにオブジェクトは使用できない。キーとして利用する際に文字列に変換する等の対応が必要になる。
      class MyId implements Stringable {
        private string $id;

        function __construct(int $number) {
          $this->id = 'A0'.$number;
        }

        function __toString(): string {
          return $this->id;
        }
      }

      class MyUser implements Stringable {
        private string $name;

        function __construct(string $name) {
          $this->name = $name;
        }

        function __toString(): string {
          return 'My name is'.$this->name;
        }
      }

      class UserIterator implements Iterator {
        private int $position = 0;

        private $users = [];

        private function reset(): void {
          $this->position = 0;
        }

        function __construct($users) {
          $this->users = $users;
          $this->reset();
        }

        function rewind(): void {
          $this->reset();
        }        

        function current(): MyUser {
          return $this->users[(string)$this->key()];
        }

        function key(): MyId {
          return new MyId($this->position);
        }

        function next(): void {
          ++$this->position;
        }

        function valid(): bool {
          return isset($this->users[(string)$this->key()]);
          // current()の戻り値をisset()に渡すとコンパイルエラーになってしまう。
          // return isset($this->current());
        }
      }

    $users = [
      (string)new MyId(0) => new MyUser('Momo'),
      (string)new MyId(1) => new MyUser('Taro'),
      (string)new MyId(2) => new MyUser('Jiro'),
      (string)new MyId(3) => new MyUser('Mike')
    ];
    $my_itr = new UserIterator($users);

    echo '<ol>';
    foreach ($my_itr as $key => $value) {
      echo '<li>Key=', var_dump($key), ',Value=', var_dump($value), '</li>';
    }
    echo '</ol>';
    ?>
    </section>
  </main>

  <footer>
    <h3>参考</h3>
    <ul>
      <li><a href="https://www.php.net/manual/ja/reserved.interfaces.php">PHPマニュアル 言語リファレンス 定義済みインターフェイスとクラス</a></li>
    </ul>
  </footer>
</body>

</html>