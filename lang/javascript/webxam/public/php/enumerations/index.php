<?php

declare(strict_types=1);
?>
<!DOCTYPE html>
<html lang="ja">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>列挙型</title>
  <link rel="stylesheet" href="../../common.css" />
</head>

<body>
  <header>
    <a href="../../">home</a>
    <h1>列挙型</h1>
  </header>

  <main>
    <section>
      <h2>Enumの比較</h2>
      <p>Pure Enum(各caseがスカラー値を持っていない)</p>
      <pre>
      enum Janken {
        case ROCK;
        case PAPER;
        case SCISSORS;
      }
      </pre>
      <p>Enumはシングルトンなので===で比較して問題ない。</p>
      <?php 
      enum Janken {
        case ROCK;
        case PAPER;
        case SCISSORS;
      }
      // Enumはシングルトン
      $janken1 = Janken::ROCK;
      $janken2 = Janken::ROCK;
      echo var_dump($janken1 === $janken2), '<br />';
      print '<p>Janken::PAPER->name:'.Janken::PAPER->name.'</p>';
      ?>
      <p>Backed Enum(各caseがスカラー値を持っている)</p>
      <pre>
      enum KenKen: int {
        case GURIKO = 5;
        case CHOCOLATE = 9;
        case PARACHUTE = 10; // スカラー値が衝突するとエラー
      }
      </pre>
      <?php
      enum KenKen: int {
        case GURIKO = 5;
        case CHOCOLATE = 9;
        case PARACHUTE = 10; // スカラー値が衝突するとエラー

        // __toString()を実装することはできない。
        // function __toString() {
        //   return $this->name;
        // }
      }

      print 'KenKen::PARACHUTE->value:'.KenKen::PARACHUTE->value.'<br />';

      echo '<p>', KenKen::from(9)->name, '</p>';
      echo '<p>', KenKen::tryFrom(-1) ?? KenKen::GURIKO->name, '</p>';
      ?>
    </section>
  </main>

  <footer>
    <h3>参考</h3>
    <ul>
      <li><a href="https://www.php.net/manual/ja/language.enumerations.php">PHPマニュアル 言語リファレンス 列挙型</a></li>
    </ul>
  </footer>
</body>

</html>