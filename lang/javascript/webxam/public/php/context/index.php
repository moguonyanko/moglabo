<?php

declare(strict_types=1);
?>
<!DOCTYPE html>
<html lang="ja">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>コンテキストオプションとパラメータ</title>
  <link rel="stylesheet" href="../../common.css" />
</head>

<body>
  <header>
    <a href="../../">home</a>
    <h1>コンテキストオプションとパラメータ</h1>
  </header>

  <main>
    <section>
      <h2>HTTPコンテキストオプション</h2>
      <?php
      // JavaにおけるgetParameterValuesにあたるAPIは存在しない？
      // だとすればパラメータ名の重複は避けなければならない。
      $postdata = http_build_query(
        [
          'columnname' => '名前',
          'columuvalue' => '𩸽を𠮟る𠮷野家'
        ]
      );

      $options = [
        'https' => [
          'method' => 'POST',
          'header' => 'Content-Type: application/x-www-form-urlencoded',
          'content' => $postdata
        ]
      ];

      $context = stream_context_create($options);

      // 引数のphpファイルがインクルードされたような状態になる。。それなら普通にincludeすればよい。
      // この記法を使う利点はあるだろうか？
      $result = file_get_contents('./sample.php', false, $context);
      var_dump($result);
      ?>
    </section>
    <section>
      <h2>ストリームフィルタ</h2>
      <p>数値を読み取って紐づく文字列に変換している。</p>
      <?php
      const angou_map = [
        1 => 'PHP',
        2 => 'Java',
        3 => 'Go',
        4 => 'JavaScript',
        5 => 'Scheme'
      ];

      class my_angou_filter extends php_user_filter
      {
        function filter($in, $out, &$consumed, $closing): int
        {
          while ($bucket = stream_bucket_make_writeable($in)) {
            $angou = trim($bucket->data);
            $bucket->data = angou_map[$angou] ?? 'Unknown';
            $consumed += $bucket->datalen;
            stream_bucket_append($out, $bucket);
          }
          return PSFS_PASS_ON;
        }
      }

      stream_filter_register('angou_filter', 'my_angou_filter') or die('フィルタ設定失敗');

      $angoup = fopen('angou.txt', 'r');
      stream_filter_append($angoup, 'angou_filter');

      // fgets呼び出し1回でファイルの内容全てがfilterメソッド内の$bucket->dataに渡されてしまう。
      while (($buffer = fgets($angoup, 4096)) !== false) {
        echo '<strong>'.$buffer.'</strong>';
      }
      if (!feof($angoup)) {
        echo '<p><em>'.'ファイルが終端に達していません！'.'</em></p>';
      }
      fclose($angoup);
      ?>
    </section>
  </main>

  <footer>
    <h3>参考</h3>
    <ul>
      <li><a href="https://www.php.net/manual/ja/context.php">PHPマニュアル 言語リファレンス コンテキストオプションとパラメータ</a></li>
      <li><a href="https://www.php.net/manual/ja/function.stream-filter-register.php">stream_filter_register</a></li>
      <li><a href="https://www.php.net/fgets">fgets</a></li>
    </ul>
  </footer>
</body>

</html>