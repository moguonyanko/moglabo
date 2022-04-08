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
  </main>

  <footer>
    <h3>参考</h3>
    <ul>
      <li><a href="https://www.php.net/manual/ja/language.types.php">PHPマニュアル 言語リファレンス</a></li>
    </ul>
  </footer>
</body>

</html>