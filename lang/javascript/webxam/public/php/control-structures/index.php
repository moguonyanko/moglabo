<?php

declare(strict_types=1);
?>
<!DOCTYPE html>
<html lang="ja">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>制御構造</title>
  <link rel="stylesheet" href="../../common.css" />
</head>

<body>
  <header>
    <a href="../../">home</a>
    <h1>制御構造</h1>
  </header>

  <main>
    <section>
      <h2>foreach</h2>
      <?php
      $arr1 = ['Foo' => 1, 'Bar' => 2, 'Baz' => 3];
      foreach ($arr1 as $key => &$value) { // この$valueのスコープはforeachの外側にも広がっていることに注意する。
        $value *= 100;
      }

      // unsetしなければ$valueは配列の最後の要素を参照したままになっている。
      // その結果予想に反する結果が表示される。
      //unset($value);

      foreach ($arr1 as $key => $value) {
        echo "<p>$key =&gt; $value</p>";
        print_r($arr1);
      }
      ?>
    </section>
    <section>
      <h2>list()</h2>
      <p>ネストした配列を反復しやすくする。</p>
      <?php
      $arr2 = [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
      ];
      foreach ($arr2 as list($x, $y, $z)) {
        echo "<p>x=$x,y=$y,z=$z</p>";
      }
      ?>
    </section>
    <section>
      <h2>match</h2>
      <p>matchは型と値を比較する。つまり暗黙の型変換が行われない。</p>
      <?php
      $myname = '100';
      $greeting = match ($myname) {
        'Foo' => 'Hello Foo',
        100 => 'Good-bye Bar', // matchは型と値を比較するのでマッチしない。
        '100' => 'Go home baz!!',
        default => 'Who are you?'
      };
      echo "<p>$greeting</p>"
      ?>
    </section>
    <section>
      <h2>include</h2>
      <p>成功したincludeの戻り値は1だが読み込んだphp内でreturnされている値で上書きできる。</p>
      <?php 
      $sample_result1 = include './sample1.php';
      $sample_result2 = include './sample2.php';
      var_dump($sample_result1);
      echo '<br />';
      var_dump($sample_result2);
      ?> 
    </section>
  </main>

  <footer>
    <h3>参考</h3>
    <ul>
      <li><a href="https://www.php.net/manual/ja/language.control-structures.php">PHPマニュアル 言語リファレンス 制御構造</a></li>
    </ul>
  </footer>
</body>

</html>