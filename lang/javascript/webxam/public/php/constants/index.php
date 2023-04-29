<?php

declare(strict_types=1); // 厳密な型付けを指定する。
?>
<!DOCTYPE html>
<html lang="ja">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>定数</title>
  <link rel="stylesheet" href="../../common.css" />
</head>

<body>
  <header>
    <a href="../../">home</a>
    <h1>定数</h1>
  </header>

  <main>
    <section>
      <h2>定数の宣言</h2>
      <?php
      const NUMBERS = [1, 2, 3, 4, 5];
      echo '<p>', implode(' ', NUMBERS), '</p>';
      //NUMBERS = []; // コンパイルエラー
      //NUMBERS[0] = 100; // これもエラー
      ?>
      <p>Javaなどと異なり配列の要素への変更もエラーとなる。</p>
    </section>
    <section>
      <h2>Constants in traits</h2>
      <?php
        trait Code {
          public const NUMBER = 123456;
        }      

        class Item {
          use Code;
        }

        //echo var_dump(Code::NUMBER); // 実行時エラー。traitをuseした側からしかアクセスできない。
        echo var_dump(Item::NUMBER);
      ?>
    </section>
  </main>

  <footer>
    <h3>参考</h3>
    <ul>
      <li><a href="https://www.php.net/manual/ja/language.constants.php">PHPマニュアル 言語リファレンス</a></li>
      <li><a href="https://www.php.net/releases/8.2/en.php#constants_in_traits">Constants in traits</a></li>
    </ul>
  </footer>
</body>

</html>