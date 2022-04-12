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
      echo "Foo ${array2['Foo']} and Bar ${array2['Bar']}", '<br />';
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
  </main>

  <footer>
    <h3>参考</h3>
    <ul>
      <li><a href="https://www.php.net/manual/ja/language.types.php">PHPマニュアル 言語リファレンス</a></li>
    </ul>
  </footer>
</body>

</html>