<?php

declare(strict_types=1);
?>
<!DOCTYPE html>
<html lang="ja">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>セッション関連</title>
  <link rel="stylesheet" href="../../common.css" />
  <!-- <script type="module" src="dataurl.js" defer></script> -->
</head>

<body>
  <header>
    <a href="../../">home</a>
    <h1>セッション関連</h1>
  </header>

  <main>
    <section>
      <h2>セッションの開始</h2>
      <?php 
      session_start();
      const counter = 'counter';
      if (!isset($_SESSION[counter])) {
        $_SESSION[counter] = 0;
      } else {
        $_SESSION[counter]++;
      }
      echo 'カウンタ:', $_SESSION[counter];
      // 手動でセッションを終了させても$_SESSIONに値は残っている。
      session_write_close();
      // セッションが変わるまではunsetしても値が残る。
      unset($_SESSION[counter]);
      ?>
    </section>
  </main>

  <footer>
    <h3>参考</h3>
    <ul>
      <li><a href="https://www.php.net/manual/ja/refs.basic.session.php">PHPマニュアル 言語リファレンス セッション関連</a></li>
    </ul>
  </footer>
</body>

</html>