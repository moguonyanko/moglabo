<?php

declare(strict_types=1);
?>
<!DOCTYPE html>
<html lang="ja">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>セッション関連</title>
  <link rel="stylesheet" href="../../common.css" />
  <!-- <script type="module" src="dataurl.js" defer></script> -->
</head>

<body>
  <header>
    <a href="../../">home</a>
    <h1>セッション関連</h1>
  </header>

  <main>
    <section>
      <h2>セッションの開始</h2>
      <?php 
      session_start();
      echo "<p>SID=", SID, "<p/>";
      const counter = 'counter';
      // セッション開始直後しかセッションの変数はクリアできない？
      //unset($_SESSION[counter]);
      if (!isset($_SESSION[counter])) {
        $_SESSION[counter] = 0;
      } else {
        $_SESSION[counter]++;
      }
      echo 'カウンタ:', $_SESSION[counter];
      // 手動でセッションを終了させても$_SESSIONに値は残っている。
      //session_write_close();
      // セッションが変わるまではunsetしても値が残る。
      // session_destroy()を呼ぶよりunsetでセッションの変数をクリアする方が推奨されている。
      // しかしクリアされないのである。
      unset($_SESSION[counter]);
      // session_unset()でもセッションの変数はクリアされない。なおこの関数の使用自体は現在は推奨されていない。
      //session_unset();
      ?>
    </section>
    <section>
      <h2>セッションIDの受渡し</h2>
      <p class="description">
        なぜかSIDが空になってしまう。<a href="https://www.php.net/manual/ja/session.constants.php">ドキュメント</a>を見る限り
        CookieにセッションIDが保存できているときは空文字になるのが正しいようだ。
      </p>
      <a href="counter.php?<?php echo htmlspecialchars(SID); ?>">カウンタ表示</a>
    </section>
    <section>
      <h2>SesshionHandler</h2>
      <a href="session_handler.php">サンプルはこちら</a>
    </section>
  </main>

  <footer>
    <h3>参考</h3>
    <ul>
      <li><a href="https://www.php.net/manual/ja/refs.basic.session.php">PHPマニュアル 関数リファレンス セッション関連</a></li>
    </ul>
  </footer>
</body>

</html>