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
    <section>
      <h2>トレイト</h2>
      <?php 
      trait Runner {
        function run() {
          echo 'running';
        }

        abstract function getName(): string;
      }

      trait Walker {
        function walk() {
          echo 'walking';
        }
        // trait間で抽象メソッドが衝突しても実装されていれば問題なし。
        abstract function getName(): string;
      }

      interface Upperable {
        function to_upper(): string;
      }

      class MyBaseMember implements Upperable {
        use Runner, Walker;

        function __construct(readonly string $name = 'no name') {
          
        }

        function getName(): string {
          return $this->name;
        }

        function to_upper(): string {
          return strtoupper($this->getName());
        }
      }

      class MySubMember extends MyBaseMember {}

      $msm = new MySubMember('kentaro');
      $msm->run();
      $msm->walk();
      echo '<p>', $msm->to_upper(), '</p>';
      ?>
    </section>
    <section>
      <h2>無名クラス</h2>
      <p>無名クラスでもトレイトは使用できる。</p>
      <?php 
      class BaseA {}
      interface InterfaceA {}
      trait TraitA {
        function toUpper(): string {
          return strtoupper($this->value);
        }
      }

      echo "<p>", ((new class('Hello') extends BaseA implements InterfaceA {
        use TraitA;

        function __construct(readonly string $value = '') { }
      })->toUpper()), "</p>";
      ?>
      <p>無名クラスには内部的な名前がつけられている。無名クラスから生成されたインスタンスは相互に異なる。</p>
      <?php 
      $anno_a = new class {};
      $anno_b = new class {};
      echo '$anno_a: ', get_class($anno_a), '<br />';
      echo '$anno_b: ', get_class($anno_b), '<br />';
      echo "\$anno_a == \$anno_b: ", var_dump($anno_a == $anno_b), '<br />';
      echo "\$anno_a === \$anno_b: ", var_dump($anno_a === $anno_b);
      ?>
    </section>
    <section>
      <h2>final</h2>
      <?php 
      class SampleA {
        // 型宣言するとエラー
        // finalがconstより後でもエラー
        // privateを指定してもエラー
        protected final const NAME = 'SAMPLE'; 
      }

      class SampleSubA extends SampleA {
        // final定数はオーバーライドできないのでエラーとなる。
        //const NAME = 'SampleSubA';

        function __toString() {
          // 以下では定数にアクセスできない。
          //return $this->NAME;
          return parent::NAME;
        }
      }

      echo new SampleSubA(), '<br />';
      ?>
    </section>
    <section>
      <h2>オブジェクトのクローン</h2>
      <?php 
      class MyCloneableBase {

        private string $name;

        function __construct(string $name = 'no name') {
          $this->name = $name;
         }

        function __clone() {
          $this->name = $this->name;
        }
      }

      class MyCloneableSub extends MyCloneableBase {

        private int $score;

        function __construct(string $name = 'no name', int $score = -1) {
          parent::__construct($name);
          $this->score = $score;
        }

        function __clone() {
           parent::__clone();
           $this->score = $this->score;
        }
      }

      $myobj1 = new MyCloneableSub($name = 'Mike', $score = 80);
      var_dump($myobj1);
      $clonedobj1 = clone $myobj1;
      var_dump($clonedobj1);
      ?>
    </section>
    <section>
      <h2>オブジェクトの比較</h2>
      <p>比較演算子(==)での比較ではプロパティが同じであれば異なるインスタンスでも等しいと判定される。</p>
      <p>一致演算子(===)なら異なるインスタンスが参照されていれば等しくないと判定される。</p>
      <?php 
      class FooFoo {
        function __construct(readonly string $name = 'no name') {
        }
      }

      $foofooA = new FooFoo();
      $foofooB = new FooFoo();
      echo '$foofooA == $foofooB: <strong>', var_dump($foofooA == $foofooB), '</strong><br />';
      echo '$foofooA === $foofooB: ', var_dump($foofooA === $foofooB), '<br />';
      $foofooB = $foofooA;
      echo '<pre>$foofooB = $foofooA</pre>';      
      echo '$foofooA == $foofooB: ', var_dump($foofooA == $foofooB), '<br />';
      echo '$foofooA === $foofooB: ', var_dump($foofooA === $foofooB), '<br />';
      ?>
    </section>
    <section>
      <h2>共変性</h2>
      <p>反変性を期待するプログラムは設計ミスが疑われる。</p>
      <?php 
      class Car {}
      class Bus extends Car {}
      class BusA extends Bus {}
      class BusB extends Bus {}
      class Track extends Car {}
      class TrackA extends Track {}
      class TrackB extends Track {}

      interface CarFactory {
        function create(string $name): Car;
      }

      class BusFactory implements CarFactory {
        // 親クラスはCar型を返すように宣言しているがCarの子クラスの型を返すことは問題ない。(共変性)
        function create(string $name): Bus {
          $name = strtoupper($name);
          if ($name === 'A') {
            return new BusA;
          } else {
            return new BusB;
          }
        }
      }

      class TrackFactory implements CarFactory {
        function create(string $name): Track {
          $name = strtoupper($name);
          if ($name === 'A') {
            return new TrackA;
          } else {
            return new TrackB;
          }
        }
      }

      echo var_dump((new BusFactory)->create('a')), '<br />';
      echo var_dump((new TrackFactory)->create('b'));
      ?>
    </section>
    <section>
      <h2>readonlyクラス</h2>
      <?php
      readonly class PerssonalData {
        public string $name;
        public int $age;

        function __construct(string $name, int $age)
        { 
          $this->name = $name;
          $this->age = $age;
        }
      }

      const pdata = new PerssonalData("Mike", 45);
      //pdata->name = 'Hoge'; // Fatal Errorになる。
      echo '<p>名前：', pdata->name, 'さん</p>';
      echo '<p>年齢：', pdata->age, '歳</p>';
      ?>
    </section>
    <section>
      <h2>Disjunctive Normal Form (DNF) Types</h2>
      <?php
      interface Walkable {}
      interface Swimable {}
      
      function checkRyoseirui((Walkable & Swimable) | null $target) {
        return $target;
      }

      class Frog implements Walkable, Swimable {}

      class Fish implements Swimable {}
      
      echo var_dump(checkRyoseirui((new Frog)));
      //echo var_dump(checkRyoseirui((new Fish))); // Type Errorになる。
      ?>
    </section>
    <section>
      <h2>stand-alone types</h2>
      <?php
      function getFalse(): false {
        //return true; // false以外を返すとTypeErrorになる。
        return false;
      }
      function getTrue(): true {
        return true;
      }
      function getNull(): null {
        return null;
      }

      echo var_dump(getFalse());
      echo var_dump(getTrue());
      echo var_dump(getNull());

      function requirePositiveNumber($number): true {
        return $number > 0;
      }

      try {
        echo var_dump(requirePositiveNumber(-1));
      } catch (TypeError $err) {
        echo '<p><strong>', $err->getMessage(), '</strong></p>';
      }
      ?>
    </section>
  </main>

  <footer>
    <h3>参考</h3>
    <ul>
      <li><a href="https://www.php.net/manual/ja/language.oop5.php">PHPマニュアル 言語リファレンス クラスとオブジェクト</a></li>
      <li><a href="https://www.php.net/releases/8.2/en.php">PHP8.2の特徴</a></li>
    </ul>
  </footer>
</body>

</html>