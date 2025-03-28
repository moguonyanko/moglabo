<!DOCTYPE html>
<html lang="ja">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>型</title>
  <link rel="stylesheet" href="../../common.css" />
</head>

<body>
  <header>
    <a href="../../">home</a>
    <h1>型</h1>
  </header>

  <main>
    <section>
      <h2>型チェック</h2>
      <div>
        <?php
        $a_bool = true;
        $a_str  = "Hello";
        $a_str2 = 'HELLO';
        $an_int = 1000;

        echo gettype($a_bool);
        echo "<br />";
        echo gettype($a_str);
        echo "<br />";
        echo gettype($an_int);
        echo "<br />";

        if (is_int($an_int)) {
          $an_int *= 1e10;
        }

        // 変数を文字列に混ぜる時はダブルクォートを使う。
        $an_type = var_dump($an_int);
        echo "<p>$an_type</p>"; // integerの範囲を超えるとfloatになる。

        if (is_bool($a_bool)) {
          echo "真偽値: <em>$a_bool</em>"; // trueは1と表示される。
        }
        ?>
      </div>
    </section>
    <section>
      <h2>キャスト</h2>
      <?php
      echo (int) ((0.1 + 0.7) * 10), '<br />';
      // 一度変数に代入してからキャストしても7になってしまう。
      $sample_value = (0.1 + 0.7) * 10;
      echo (int)$sample_value, '<br />';
      // intval関数を使っても7になる。浮動小数点数の値を迂闊に型変換するなということ。
      echo intval($sample_value);
      ?>
    </section>
    <section>
      <h2>暗黙の型変換</h2>
      <p>文字列型の値は先行する数値型の値に合わせて変換される。クォートの種別は関係ない。</p>
      <?php
      $sample_value2 = 1 + "99";
      echo "1 + \"99\" = $sample_value2", '<br />';
      $sample_value3 = 1 + '99';
      echo "1 + '99' = $sample_value3";
      ?>
    </section>
    <section>
      <h2>配列</h2>
      <p>Mapに近い使い方もできる。ただしキーにオブジェクトは使用できない。</p>
      <?php
      $array1 = array(1, 2, TRUE, "Foo", null, 'Hello');
      ?>
      <ul>
        <?php
        foreach ($array1 as $value1) {
          echo  "<li>$value1</li>";
        }
        $array1[] = 'World';
        echo "Added 「$array1[6]」";
        ?>
      </ul>
      <p>負やサイズを超えたインデックスを指定するとエラーになる。nullの値は空文字に変換される。</p>
      <?php
      $array2 = ['Foo' => 100, 'Bar' => 200];
      echo "Foo {$array2['Foo']} and Bar {$array2['Bar']}", '<br />';
      unset($array2['Foo']);
      // unsetされたキーを参照するとエラー
      //echo "Foo ${array2['Foo']} and Bar ${array2['Bar']}";
      $diff_result = $array1 === $array2;
      echo "array1 === array2 :", $diff_result;
      ?>
      <p>falseは空文字になってしまう。</p>
      <?php
      $array3 = [100, 200, 300];
      // 代入では配列はコピーされる。
      $array4 = $array3;
      // コピー元の配列は変更されない。
      $array4[0] = 1000;
      echo '$array3[0]=', "$array3[0]", ",", '$array4[0]=', "$array4[0]", '<br />';
      // リファレンスでコピーすればコピー元も変更される。
      $array4 = &$array3;
      $array4[0] = 2000;
      echo '$array3[0]=', "$array3[0]", ",", '$array4[0]=', "$array4[0]";
      ?>
    </section>
    <section>
      <h2>Iteratable</h2>
      <?php
      function getArray(): iterable {
        return ["Foo", "Bar", "Baz"];
      }
      function iteratableToListElement(iterable $iteratable) {
        echo '<ul>';
        foreach ($iteratable as $value) {
          echo "<li>$value</li>";
        }
        echo '</ul>';
      }
      ?>
      <!-- phpタグを跨いでも関数を参照できる。 -->
      <?php
      iteratableToListElement(getArray());
      ?>
    </section>
    <section>
      <h2>列挙型</h2>
      <?php
      enum ShapeType 
      {
        case Circle;
        case Polygon;
        case Line;
        case Symbol;
      }
      foreach (ShapeType::cases() as $type) {
        $type_name = var_dump($type);
        echo "<p>$type_name</p>";
      }
      ?>
    </section>
    <section>
      <h2>コールバック関数</h2>
      <?php
      enum AnimalType {
        case Dog;
        case Cat;
      } 
      class Animal {
        function talk() {
          return 'なにかの動物です';
        }
      }
      class Cat extends Animal {
        static function getAnimalType() {
          return AnimalType::Cat;
        }
        function talk() {
          return 'NyaNyaNya';
        } 
        function __invoke($name) {
          return "My name is $name";
        }
      }
      $my_cat = new Cat();
      echo '😸&lt', '<strong>', call_user_func([$my_cat, 'talk']), '</strong><br />';
      echo var_dump(call_user_func('Cat::getAnimalType')), '<br />';
      echo '<em>▼PHP8.3以降はparent::talkという形式は警告される。警告なく置き換える書き方は不明。</em><br />';
      echo '？？？&lt', '<strong>', call_user_func([$my_cat, 'parent::talk']), '</strong><br />';
      echo '😸&lt', '<strong>', call_user_func($my_cat, 'タマ'), '</strong><br />';
      ?>
      <p>クロージャだと以下の通り</p>
      <?php
      $pow = function($n) {
        return $n ** 2;
      };
      $numbers = range(10, 20);
      $new_numbers = array_map($pow, $numbers);
      print implode(',', $new_numbers);
      ?>
    </section>
    <section>
      <h2>型宣言</h2>
      <?php 
      interface Fly {
        function getHeight(): int;
      }
      
      class Plane implements Fly {
        function getHeight(): int {
          return 1000;
        }
        function getDescription(): ?string {
          return null; // 戻り値の型にNull許容型が指定されていなければエラーになる。
        }
        function copy(): static {
          return new Plane;
        }
      }
      
      class Car {}
      
      function viewFlyer(Fly $flyer) {
        echo 'これは'.get_class($flyer).'です<br />'; // 文字列連結はピリオドでもいい。
      }

      viewFlyer(new Plane());
      // viewFlyer(new Car()); // 型が不一致のためコンパイルエラーになる。
      // viewFlyer(null); // viewFlyerの引数がNull許容型ではないのでエラー。
      ?>
    </section>
    <section>
      <h2>TypeError</h2>
      <?php 
      function square(int $a): int {
        return $a ** 3;
      }
      echo '<p>', var_dump(square(2)), '</p>';
      ?>
      <div>
      <p>警告の確認</p>
      <?php
      //declare(strict_types=1); スクリプトの先頭にしか書けない。

      try {
        echo '<p>', var_dump(square(1.5)), '</p>';
      } catch (TypeError $err) {
        // 厳密な型付けが指定されていればTypeErrorがスローされる。
        // そうでなければ警告止まりとなる。
        echo '<em>', $err->getMessage(), '</em>';
      }
      ?>
      </div>
    </section>
  </main>

  <footer>
    <h3>参考</h3>
    <ul>
      <li><a href="https://www.php.net/manual/ja/language.types.php">PHPマニュアル 言語リファレンス</a></li>
    </ul>
  </footer>
</body>

</html>