<?php
declare(strict_types=1);
?>
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Session Handler</title>
  </head>
  <body>
      <?php

      class UpcaseSessionHandler extends SessionHandler {

          function read(string $id): string|false {
              $data = parent::read($id);
              if (!$data) {
                  return '';
              } else {
                  // TODO: こちら側に処理が到達することがないため値を大文字にできない。
                  return strtoupper((string)$data);
              }
          }

          function write(string $id, string $data): bool {
              //print $data;
              return parent::write($id, strtoupper((string)$data));
          }

      }

      ini_set('session.save_handler', 'files');
      $handler = new UpcaseSessionHandler();
      session_set_save_handler($handler, true);
      session_start();

      $name = 'name';
      $_SESSION[$name] = 'foobarbaz';
      // $_SESSION[$name]はスカラー型ではないので左辺をconstで宣言することはできない。
      $result = $_SESSION[$name];
      echo "<strong>", $result, '</strong>';
      unset($_SESSION[$name]);
      ?>
  </body>
</html>
