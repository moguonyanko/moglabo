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
    <section>
      <h2>複数の文字列のエンコーディング変更</h2>
      <p>BASE64をmbstringで使うのは非推奨とされている。</p>
      <?php 
      $w1 = 'こんにちは';
      $w2 = '𩸽を𠮟る𠮷野家';
      echo '<p>'.$w1.','.$w2.'</p>';
      $internal_enc = mb_internal_encoding();
      echo '<p>内部エンコーディング='.$internal_enc.'</p>';
      $output_enc = 'SJIS-win';
      echo '<p>出力エンコーディング='.$output_enc.'</p>';
      $input_enc = mb_convert_variables($output_enc, $internal_enc, $w1, $w2);
      echo '<p>'.$input_enc.'から'.$output_enc.'に変更しました。</p>';
      echo '<p>'.$w1.','.$w2.'</p>';
      $input_enc = mb_convert_variables($internal_enc, $output_enc, $w1, $w2);
      echo '<p>'.$input_enc.'から'.$internal_enc.'に戻しました。</p>';
      echo '<p>'.$w1.','.$w2.'</p>';
      echo '<p>サロゲートペア文字を含む文字列をサロゲートペア文字を扱えないエンコーディングに変換した場合は元に戻らない。</p>'
      ?>
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