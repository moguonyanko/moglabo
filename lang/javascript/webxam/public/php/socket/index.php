<?php

declare(strict_types=1);
?>
<!DOCTYPE html>
<html lang="ja">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ソケット</title>
  <link rel="stylesheet" href="../../common.css" />
</head>

<body>
  <header>
    <a href="../../">home</a>
    <h1>ソケット</h1>
  </header>

  <main>
    <section>
      <h2>socket_connectによるMySQL接続</h2>
      <?php
      function handle_error($result)
      {
        var_dump($result);
        die('<p class="error">ソケット接続失敗: '.socket_strerror(socket_last_error()).'</p>');
      }
      
      $host = 'myhost';
      $user = 'sampleuser';
      $password = 'samplepass';
      $port = 3306;
      $dbname = 'test';

      $socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);

      $result = socket_connect($socket, $host, $port);
      if (!$result) {
        handle_error($result);
      }

      $command = "mysql --user=$user --password=$password --host=$host --port=$port --database=$dbname";
      $result = socket_write($socket, $command);
      if (!$result) {
        handle_error($result);
      }

      $command = "SELECT 1";
      $result = socket_write($socket, $command);
      if (!$result) {
        handle_error($result);
      }

      $response = socket_read($socket, 1024);

      if (strlen($response) == 1) {
        echo "<p>$dbname に接続成功: $response</p>";
      } else {
        echo "<p class=\"error\">$dbname に接続失敗: $response</p>";
      }

      socket_close($socket);
      ?>
    </section>
    <section>
      <h2>fsocketopenによるMySQL接続</h2>
      <?php
      $fsocket = fsockopen($host, $port, $err_no, $err_message, 5);
      if (!$fsocket) {
        handle_error($fsocket);
      }
      $packet = pack('V', 0x0000000a).pack('V', 0x00000000).'xxxxxxxx';
      $packet .= pack('a', $user).'\x00';
      $packet .= pack('a', $password).'\x00';
      $packet .= pack('a', $dbname).'\x00';

      fwrite($fsocket, $packet);

      $fresponse = fread($fsocket, 1024);
      $connect_success = strpos($fresponse, '\x00\x00\x00\x02') !== false;

      if ($connect_success) {
        echo "<p>$dbname に接続成功: $fresponse</p>";
      } else {
        echo "<p class=\"error\">$dbname に接続失敗: $fresponse</p>";
      }
      ?>
    </section>
  </main>

  <footer>
    <h3>参考</h3>
    <ul>
      <li><a href="https://www.php.net/manual/ja/book.sockets.php">ソケット</a></li>
    </ul>
  </footer>
</body>

</html>