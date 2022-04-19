<?php

declare(strict_types=1);
?>
<!DOCTYPE html>
<html lang="ja">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>クラスとオブジェクト</title>
  <link rel="stylesheet" href="../../common.css" />
</head>

<body>
  <header>
    <a href="../../">home</a>
    <h1>クラスとオブジェクト</h1>
  </header>

  <main>
    <section>
      <h2>プロパティと無名関数</h2>
      <?php 
      class MyClass {
        public $myname = 'Mike';

        function __construct(string $name = 'NO NAME') {
          $this->myname = function() use ($name): string {
            return $name;
          };
        }
      }

      $myobj = new MyClass($name = 'Jiro');
      echo var_dump($myobj->myname), '<br />'; // 元のプロパティは関数で置き換えられている。
      echo ($myobj->myname)(), PHP_EOL;
      ?>
    </section>
    <section>
      <h2>オーバーライド</h2>
      <?php 
      class MyBase {
        function hello(string $name = 'NO NAME'): string {
          return "Hello, $name";
        }
      }

      class MySub extends MyBase {
        // Javaと異なり親クラスのメソッドとシグネチャが異なるとエラーになってしまう。
        // オプショナルな引数を必須の引数にしただけでもシグネチャが変わったものと見なされる。
        //function hello(string $name): string { 
        function hellosub(string $name): string { 
            return parent::hello($name);
        }
      }

      echo (new MySub())->hellosub('Peter'), '<br />';
      ?>
    </section>
    <section>
      <h2>nullsafe 演算子</h2>
      <?php 
      class Foo {
        // readonlyプロパティは初期値を設定できない。型付きプロパティのみreadonlyを指定できる。
        private readonly ?int $value;

        function __construct() {
          // 型付きプロパティはアクセス前の初期化が必須なので以下の行がないとエラーになる。
          // 初期化はreadonlyプロパティと同じスコープで行われる必要がある。
          $this->value = null;
        }

        function getValue(): ?int {
          return $this->value;
        }
      }

      $defaultvalue = 1000;
      $foo_obj = new Foo();
      // readonlyプロパティのスコープ外で初期化できない。
      //$foo_obj->value = 100;

      $result = $foo_obj?->getValue()?->$defaultvalue;

      echo var_dump($result);
      ?>
    </section>
    <section>
      <h2>コンストラクタ</h2>
      <?php 
      class Base1 {
        function __construct(int $x) {
          echo $x, Base1::class, PHP_EOL;
        }
      }

      class Sub1 extends Base1 {
        function __construct() {
          echo Sub1::class, PHP_EOL;
          // 親クラスのコンストラクタ呼び出しは先頭でなくてもいい。
          parent::__construct(x: 100);
        }
      }

      class SubSub1 extends Sub1 {}

      new SubSub1;
      ?>
    </section>
    <section>
      <h2>コンストラクタのプロモーション</h2>
      <?php 
      class Position {
        // $lonや$latがprotectedやprivateだとクラス外からアクセスできない。
        // readonlyを外すとプロパティが認識されなくなりエラーになる。
        function __construct(readonly float $lon, readonly float $lat) { 
          // Does nothing
        }
      }

      $pos = new Position($lon = 10.15, $lat = 32.45);
      echo '自動的にプロパティに昇格された:', "$pos->lon, $pos->lat";
      ?>
    </section>
    <section>
      <h2>静的な生成メソッド</h2>
      <p>ファクトリメソッドのようなものである。</p>
      <?php 
      class MyMember {
        private function __construct(readonly string $name = '', readonly int $age = -1) { }

        public static function getInstance($data): static {
          $new = new static($data[0], $data[1]);
          return $new;
        }

        function __toString(): string {
          return "$this->name:$this->age";
        }

        function __destruct() {
          print 'Destructed:'.__CLASS__.'<br />';
        }
      }

      function mymember_dump() {
        $mymember = MyMember::getInstance(['Mike', 29]);
        echo $mymember, '<br />';
      }

      mymember_dump();
      ?>
    </section>
  </main>

  <footer>
    <h3>参考</h3>
    <ul>
      <li><a href="https://www.php.net/manual/ja/language.oop5.php">PHPマニュアル 言語リファレンス クラスとオブジェクト</a></li>
    </ul>
  </footer>
</body>

</html>