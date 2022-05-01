<?php

declare(strict_types=1);
?>
<!DOCTYPE html>
<html lang="ja">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ファイバー</title>
  <link rel="stylesheet" href="../../common.css" />
</head>

<body>
  <header>
    <a href="../../">home</a>
    <h1>ファイバー</h1>
  </header>

  <main>
    <h2>ファイバーの開始・停止・再開</h2>
    <p>戻り値のある関数を渡してFiberインスタンスを生成してもresumeで値が返されることはない。</p>
    <?php 
    $func = function (): string {
      $result = 'ファイバー停止中';
      $value = Fiber::suspend($result);
      echo 'Current value:', $value;
      return 'Finish Fiber'; // この値が返されることはない。
    };

    $fiber = new Fiber($func);

    $value1 = $fiber->start();
    echo '<p>Suspend:', $value1, '</p>';

    $value2 = $fiber->resume('ファイバー再開');
    echo '<p>Resume:', var_dump($value2), '</p>';
    ?>
  </main>

  <footer>
    <h3>参考</h3>
    <ul>
      <li><a href="https://www.php.net/manual/ja/language.fibers.php">PHPマニュアル 言語リファレンス ファイバー</a></li>
    </ul>
  </footer>
</body>

</html>