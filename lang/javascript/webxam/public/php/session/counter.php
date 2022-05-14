<?php

declare(strict_types=1);
?>
<!DOCTYPE html>
<html lang="ja">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>カウンタ</title>
  <link rel="stylesheet" href="../../common.css" />
  <!-- <script type="module" src="dataurl.js" defer></script> -->
</head>

<body>
  <header>
    <a href="../../">home</a>
    <h1>カウンタ</h1>
  </header>

  <main>
    <section>
      <h2>セッションの開始</h2>
      <?php 
      // sesshon_start()しないと$_SESSIONの変数を取得できない。常にemptyになる。
      session_start();
      const counter = 'counter';
      if (empty($_SESSION[counter])) {
        $_SESSION[counter] = 1;
      } else {
        $_SESSION[counter]++;
      }
      echo 'カウンタ:', $_SESSION[counter];
      ?>
    </section>
  </main>
</body>

</html>