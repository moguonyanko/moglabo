<?php

declare(strict_types=1);
?>
<!DOCTYPE html>
<html lang="ja">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Cookie</title>
  <link rel="stylesheet" href="../../common.css" />
</head>

<body>
  <header>
    <a href="../../">home</a>
    <h1>Cookie</h1>
  </header>

  <main>
    <section>
      <h2>setcookie</h2>
      <?php 
      if (isset($_COOKIE['MyTestCookie'])) {
        echo '<ul>';
        foreach ($_COOKIE['MyTestCookie'] as $name => $value) {
          $name = htmlspecialchars((string)$name);
          $value = htmlspecialchars($value);
          echo "<li>$name : $value</li>";
        }
        echo '</ul>';
      }

      $t = time();
      $value = "参考データ:$t";
      $expires = $t + (60 * 60); // 1時間
      $path = '/webxam/';
      $domain = '';
      $secure = true;
      $httponly = true;
      setcookie('MyTestCookie[0]', "$value:One", $expires, $path, $domain, $secure, $httponly);
      setcookie('MyTestCookie[1]', "$value:Two", $expires, $path, $domain, $secure, $httponly);
      setcookie('MyTestCookie[2]', "$value:Three", $expires, $path, $domain, $secure, $httponly);
      //setrawcookie('MyTestCookie[2]', "$value:Three, Raw", $expires, $path, $domain, $secure, $httponly);
      ?>
    </section>
  </main>

  <footer>
    <h3>参考</h3>
    <ul>
      <li><a href="https://www.php.net/manual/ja/features.cookies.php">PHPマニュアル 機能 クッキー(Cookies)</a></li>
    </ul>
  </footer>
</body>

</html>