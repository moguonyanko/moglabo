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

      $result = file_get_contents('./sample.php', false, $context);
      var_dump($result);
      ?>
    </section>
  </main>

  <footer>
    <h3>参考</h3>
    <ul>
      <li><a href="https://www.php.net/manual/ja/context.php">PHPマニュアル 言語リファレンス コンテキストオプションとパラメータ</a></li>
    </ul>
  </footer>
</body>

</html>