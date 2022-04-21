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

        // 戻り値とコンストラクタ呼び出しのstaticをMyMemberにしても問題ない。
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
    <section>
      <h2>定数のアクセス権</h2>
      <?php
      // デフォルトはpublicになる。
      class MyBase1 {
        const PUBLIC = 'pub';
        protected const PROTECTED = 'pro';
        private const PRIVATE = 'pri';
        
        function description(): string {
          // self経由でアクセスしないとエラー。$this経由ではダメ。
          return __CLASS__;
        }

        private function hello(): string {
          return 'HELLO';
        }
      }

      class MySub1 extends MyBase1 {
        // 同名で宣言しても親クラスの定数を隠してしまうだけ。
        private const PRIVATE = 'PRIVATE!';
        // 型が同じであれば別インスタンスからでも参照できる。
        private string $name;

        // プロパティへの昇格が行われる書き方では$nameをprivateにできないので自分で代入する。
        function __construct(string $name) {
          $this->name = $name;
        }

        function getName(MySub1 $other): string {
          return $other->name;
        }

        function description(): string {
          return self::PUBLIC.self::PROTECTED.self::PRIVATE.__CLASS__;
        }

        // オーバーライドできない親クラスのメソッドと衝突してもエラーにはならない。
        function hello(): string {
          return 'SUB Hello!';
        }
      }

      $mysub1 = new MySub1('Mike');
      $mysub2 = new MySub1('Joe');
      echo $mysub1->description(), $mysub1->hello(), $mysub1->getName($mysub2);
      ?>
    </section>
    <section>
      <h2>クラスの抽象化</h2>
      <?php 
      abstract class MyData {
        abstract protected function description(string $text): string;
      }

      class MyDataImpl extends MyData {
        // オプション引数（＝デフォルト値が指定されている引数）であれば親クラスの抽象メソッドに定義されていなくても
        // 追加することができる。
        function description(string $text, string $suffix = ''): string {
          return $text.$suffix;
        }
      }

      $mydata1 = new MyDataImpl();
      echo '<p>', $mydata1->description('Hello abstract class!', '★★★★★★'), '</p>';
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