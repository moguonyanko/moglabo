<?php

declare(strict_types=1);
?>
<!DOCTYPE html>
<html lang="ja">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>データベースの扱い</title>
  <link rel="stylesheet" href="../../common.css" />
</head>

<body>
  <header>
    <a href="../../">home</a>
    <h1>データベースの扱い</h1>
  </header>

  <main>
    <section>
      <h2>PDOオブジェクトの生成</h2>
      <?php
      // jdbc:mysql://localhost:3306/test
      echo '<ol>';
      try {
        $user = 'sampleuser';
        $password = 'samplepass';
        $dbh = new PDO('mysql:host=localhost;dbname=test', $user, $password);
        // PHP8.0.0以降はデフォルトでPDO::ERRMODE_EXCEPTIONなので指定しなくてよい。
        //$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $sth = $dbh->prepare('SELECT * FROM authors');
        $sth->execute();
        while ($row = $sth->fetch(PDO::FETCH_NUM, PDO::FETCH_ORI_NEXT)) {
          echo '<li>' . $row[0] . ':' . $row[1] . '</li>';
        }
      } catch (PDOException $err) {
        echo '<strong>' . $err->getMessage() . '</strong>';
      }
      echo '</ol>';
      ?>
    </section>
  </main>

  <footer>
    <h3>参考</h3>
    <ul>
      <li><a href="https://www.php.net/manual/ja/book.pdo.php">PDO</a></li>
    </ul>
  </footer>
</body>

</html>