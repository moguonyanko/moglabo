<?php

declare(strict_types=1); // 厳密な型付けを指定する。
?>
<!DOCTYPE html>
<html lang="ja">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>変数</title>
  <link rel="stylesheet" href="../../common.css" />
</head>

<body>
  <header>
    <a href="../../">home</a>
    <h1>変数</h1>
  </header>

  <main>
    <section>
      <h2>変数のスコープ</h2>
      <?php
      $sample_name = 'Mike'; // グローバルスコープ

      function getSampleName(): string {
        // 以下の$sample_nameはローカルスコープ参照となる。未宣言のためエラー。
        // グローバルスコープの変数は参照されない。
        // return $sample_name;

        // $GLOBALS経由で参照する。
        // return $GLOBALS['sample_name'];
        // あるいはグローバルスコープの変数を参照することを宣言する。
        global $sample_name;
        return $sample_name;
      }

      print_r(getSampleName());
      ?>
    </section>
    <section>
      <h2>静的変数</h2>
      <?php
      function getCount(): int {
        static $count = 0; // 初期化は1回しか行われない。結果だけ見ればジェネレータと同じになる。
        // static $x = getCount(); // 関数呼び出しで初期化するのはエラー。
        return $count++;
      }
      echo '<p>', getCount(), getCount(), getCount(), '</p>';
      echo '<p>', getCount(), getCount(), getCount(), '</p>';
      echo '<p>', getCount(), getCount(), getCount(), '</p>';
      ?>
    </section>
    <section>
      <h2>Cookie</h2>
      <?php
      setcookie('samplecookie', '𩸽を𠮟る𠮷野家', [
        'expires' => time() + 60 * 60, 
        'httponly' => true, 
        'secure' => true,
        'samesite' => 'None'
      ]);
      ?>
      <form action="./sample.php?appid=12345" method="POST">
        <label>名前<input type="text" name="name" value="😸" /></label>
        <label>年齢<input type="number" name="age" value="35" min="0" max="130" /></label>
        <button>送信</button>
      </form>
    </section>
  </main>

  <footer>
    <h3>参考</h3>
    <ul>
      <li><a href="https://www.php.net/manual/ja/language.variables.php">PHPマニュアル 言語リファレンス</a></li>
    </ul>
  </footer>
</body>

</html>