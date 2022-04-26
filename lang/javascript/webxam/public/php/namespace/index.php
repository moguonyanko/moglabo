<?php

declare(strict_types=1);
?>
<!DOCTYPE html>
<html lang="ja">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>名前空間</title>
  <link rel="stylesheet" href="../../common.css" />
</head>

<body>
  <header>
    <a href="../../">home</a>
    <h1>名前空間</h1>
  </header>

  <main>
    <section>
      <h2>名前空間内の関数やプロパティへのアクセス</h2>
      <?php
      include 'samplenamespace1.php';
      use samplenamespace1\Exception as MyException;

      // グローバルな方の関数が呼び出される。
      echo strtoupper('hello'), '<br />';

      echo samplenamespace1\strtoupper('hello'), '<br />';
      echo samplenamespace1\INT_ALL, '<br />';
      echo new MyException('sample error');
      ?>
    </section>
    <section>
      <h2>エイリアスとインポート</h2>
      <?php
      include 'mymath.php';
      use mymath\{SampleA as smA, SampleB as smB};
      use const mymath\PI;
      use function mymath\{add ,sub, mul, div}; 

      echo '<p>', var_dump(new smA), var_dump(new smB), '</p>';
      echo '<p>', mul(mul(10, 10), PI), '</p>';
      ?>
    </section>
  </main>

  <footer>
    <h3>参考</h3>
    <ul>
      <li><a href="https://www.php.net/manual/ja/language.namespaces.php">PHPマニュアル 言語リファレンス 名前空間</a></li>
    </ul>
  </footer>
</body>

</html>