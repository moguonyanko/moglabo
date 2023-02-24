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
      function connect(): PDO
      {
        try {
          $user = 'sampleuser';
          $password = 'samplepass';
          $dbh = new PDO('mysql:host=localhost;dbname=test', $user, $password);
          return $dbh;
        } catch (PDOException $err) {
          echo '<strong>' . $err->getMessage() . '</strong>';
          throw $err;
        }
      }

      // jdbc:mysql://localhost:3306/test
      echo '<ol>';
      $dbh = connect();
      // PHP8.0.0以降はデフォルトでPDO::ERRMODE_EXCEPTIONなので指定しなくてよい。
      //$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
      $sth = $dbh->prepare('SELECT * FROM authors');
      $sth->execute();
      while ($row = $sth->fetch(PDO::FETCH_NUM, PDO::FETCH_ORI_NEXT)) {
        echo '<li>' . $row[0] . ':' . $row[1] . '</li>';
      }
      echo '</ol>';
      $dbh = null;
      ?>
    </section>
    <section>
      <h2>プリペアドステートメント</h2>
      <?php
      $dbh = connect();
      $sth = $dbh->prepare('SELECT * FROM authors WHERE id = ? OR id = ?');
      $sth->execute(['B001', 'Y001']);
      // printでは配列を文字列で出力できない。
      //print_r($result);
      while ($row = $sth->fetch(PDO::FETCH_ASSOC)) {
        echo '<p>' . $row['id'] . ':' . $row['name'] . '</p>';
      }
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