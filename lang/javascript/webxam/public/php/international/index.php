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
    <section>
      <h2>mb_convert_kana</h2>
      <?php
      $opts = "KVA";
      echo "<p>オプション:$opts</p>";
      $sampleword = 'ﾊﾝｶｸｶﾅ ZENKAKU 12345'; 
      echo nl2br("サンプル:$sampleword\n");
      echo '半角カナは全角カナ、半角英数字は全角英数字に変換 => ', mb_convert_kana($sampleword, $opts);
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