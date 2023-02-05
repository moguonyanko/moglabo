<?php

declare(strict_types=1);
?>
<!DOCTYPE html>
<html lang="ja">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>マルチバイト文字列</title>
  <link rel="stylesheet" href="../../common.css" />
</head>

<body>
  <header>
    <a href="../../">home</a>
    <h1>マルチバイト文字列</h1>
  </header>

  <main>
    <section>
      <h2>サポートエンコーディング一覧</h2>
      <div class="output">
      <?php
      foreach (mb_list_encodings() as $encoding) {
        echo $encoding.'<br />';
      } 
      ?>
      </div>
    </section>
  </main>

  <footer>
    <h3>参考</h3>
    <ul>
      <li><a href="https://www.php.net/manual/ja/book.mbstring.php">マルチバイト文字列</a></li>
    </ul>
  </footer>
</body>

</html>