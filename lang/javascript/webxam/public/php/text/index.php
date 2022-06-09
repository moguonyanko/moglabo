<?php

declare(strict_types=1);
?>
<!DOCTYPE html>
<html lang="ja">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>テキスト処理</title>
  <link rel="stylesheet" href="../../common.css" />
</head>

<body>
  <header>
    <a href="../../">home</a>
    <h1>テキスト処理</h1>
  </header>

  <main>
    <section>
      <h2>PCRE 正規表現 (Perl 互換)</h2>
      <section>
        <h3>preg_split</h3>
        <?php 
        const SUBJECT = 'Java PHP Perl Rust Swift JavaScript Python';
        $langs = preg_split('/[\s]+/', SUBJECT);
        print_r($langs);
        echo '<br />';
        $words = preg_split('/[\s]+/', SUBJECT, -1, PREG_SPLIT_OFFSET_CAPTURE);
        print_r($words);
        ?>
      </section>
      <section>
        <h3>preg_match</h3>
        <?php 
        // $matchesは宣言していなくても問題ない。
        preg_match('/(Java)/', SUBJECT, $matches, PREG_OFFSET_CAPTURE);
        print_r($matches);
        // 文字列が含まれるかどうかの判定を行いたいだけならstrposの方が高速で好ましい。
        print_r(strpos(SUBJECT, 'Ruby'));
        ?>
      </section>
    </section>
  </main>

  <footer>
    <h3>参考</h3>
    <ul>
      <li><a href="https://www.php.net/manual/ja/refs.basic.text.php">PHPマニュアル 関数リファレンス テキスト処理</a></li>
    </ul>
  </footer>
</body>

</html>