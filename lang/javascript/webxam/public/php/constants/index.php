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
  </main>

  <footer>
    <h3>参考</h3>
    <ul>
      <li><a href="https://www.php.net/manual/ja/language.constants.php">PHPマニュアル 言語リファレンス</a></li>
    </ul>
  </footer>
</body>

</html>