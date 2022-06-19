<?php

declare(strict_types=1);
?>
<!DOCTYPE html>
<html lang="ja">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>自然言語および文字エンコーディング</title>
  <link rel="stylesheet" href="../../common.css" />
</head>

<body>
  <header>
    <a href="../../">home</a>
    <h1>自然言語および文字エンコーディング</h1>
  </header>

  <main>
    <section>
      <h2>iconv</h2>
      <?php 
      $sample = 'こんにちはこんばんわ';
      $sample_sjis = iconv('UTF-8', 'SJIS', $sample);
      echo 'SJIS:', $sample_sjis, '<br />';
      $sample_utf8 = iconv('SJIS', 'UTF-8', $sample_sjis);
      echo 'UTF-8:', $sample_utf8;
      ?>
    </section>
  </main>

  <footer>
    <h3>参考</h3>
    <ul>
      <li><a href="https://www.php.net/manual/ja/refs.international.php">PHPマニュアル 関数リファレンス 自然言語および文字エンコーディング</a></li>
    </ul>
  </footer>
</body>

</html>