<?php

declare(strict_types=1);
?>
<!DOCTYPE html>
<html lang="ja">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>例外</title>
  <link rel="stylesheet" href="../../common.css" />
</head>

<body>
  <header>
    <a href="../../">home</a>
    <h1>例外</h1>
  </header>

  <main>
    <section>
      <h2>例外変数の省略</h2>
      <?php
      class MyCustomException extends Exception {}

      function throwMyCustomException(string $message) {
        strlen($message) > 0 or throw new MyCustomException($message);
      }

      try {
        throwMyCustomException('');
        echo 'エラーなし';
      } catch (MyCustomException) {
        echo 'エラー発生(変数は未使用)';
      }
      ?>
    </section>
  </main>

  <footer>
    <h3>参考</h3>
    <ul>
      <li><a href="https://www.php.net/manual/ja/language.exceptions.php">PHPマニュアル 言語リファレンス 例外</a></li>
    </ul>
  </footer>
</body>

</html>