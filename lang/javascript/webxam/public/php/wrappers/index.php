<?php

declare(strict_types=1);
?>
<!DOCTYPE html>
<html lang="ja">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>サポートするプロトコルとラッパー</title>
  <link rel="stylesheet" href="../../common.css" />
</head>

<body>
  <header>
    <a href="../../">home</a>
    <h1>サポートするプロトコルとラッパー</h1>
  </header>

  <main>
    <section>
      <h2>glob://</h2>
      <?php 
      $iter = new DirectoryIterator('glob://./*.php');
      echo '<p>', var_dump($iter), '</p>';
      foreach ($iter as $f) {
        printf('<p>%s: %.1FKB</p>', $f->getFilename(), $f->getSize() / 1024);
      }
      ?>
    </section>
    <section>
      <h2>data://</h2>
      <?php 
      // データ自体は echo -n HelloWorld | base64 で得た。
      $imgurl = 'data://text/plain;base64,SGVsbG9Xb3JsZA==';
      // 画像をDataURLにエンコードしたわけではないので表示できない。
      //echo '<img src="', $imgurl, '" />', '<br />';
      echo '<p>', file_get_contents($imgurl), '</p>';
      ?>
    </section>
  </main>

  <footer>
    <h3>参考</h3>
    <ul>
      <li><a href="https://www.php.net/manual/ja/wrappers.php">PHPマニュアル 言語リファレンス サポートするプロトコル/ラッパー</a></li>
    </ul>
  </footer>
</body>

</html>