<?php

declare(strict_types=1);
?>
<!DOCTYPE html>
<html lang="ja">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ジェネレータ</title>
  <link rel="stylesheet" href="../../common.css" />
</head>

<body>
  <header>
    <a href="../../">home</a>
    <h1>ジェネレータ</h1>
  </header>

  <main>
      <section>
      <h2>ジェネレータの生成</h2>
      <?php 
      class MyRange {
        function __construct(readonly int $start, readonly int $limit, readonly int $step= 1) {
          if ($start > $limit) {
            throw new LogicException("開始位置 $start は終端 $limit 以上にしてください。");
          }
          if ($step <= 0) {
            throw new LogicException("ステップ数は1以上にしてください。: $step");
          }
        }

        function create_range() {
          for ($index = $this->start; $index < $this->limit; $index += $this->step) {
            yield $index;
          }
        }
      }

      $range = new MyRange(0, 10, 2);
      foreach ($range->create_range() as $number) {
        print $number;
        print '<br />';
      }
      ?>
    </section>
    <section>
      <h2>配列を返すジェネレータ</h2>
      <?php
      $csv = <<<'EOF'
      10001,Mike,166,78
      10002,Taro,164,90
      10003,Peter,179,80
      EOF;

      function parse_csv($csv) {
        // '\n'とシングルクォートで囲んでしまうと改行文字だとみなされなくなる。
        foreach (explode("\n", $csv) as $line) {
          $columns = explode(',', $line);
          $id = array_shift($columns);
          yield $id => $columns;
        }
      }

      foreach (parse_csv($csv) as $id => $columns) {
        echo $id, ':', implode(' ', $columns), '<br />';
      } 
      ?>
    </section>
    <section>
      <h2>参照のyield</h2>
      <?php 
      // 参照をyieldするため外部で値を変更されるとその影響が関数内の変数に及ぶ。
      function &get_current_value($max) {
        $value = 0;

        while ($value < $max) {
          yield $value;
        }
      }

      foreach (get_current_value($max = 100) as &$number) {
        echo '<span>', $number += 10, '</span><br />';
      }
      ?>
    </section>
    <section>
      <h2>ジェネレータの委譲</h2>
      <?php 
      function get_hello() {
        yield 'Hello';
      }

      function get_goodnight() {
        yield 'Good night';
      }

      function greet() {
        yield 'こんにちは';
        yield 'こんばんわ';
        yield from get_hello();
        return yield from get_goodnight();
      }

      $g = greet();
      foreach ($g as $text) {
        echo $text, '<br />';
      }
      print $g->getReturn(); // 出力なし
      ?>
    </section>
  </main>

  <footer>
    <h3>参考</h3>
    <ul>
      <li><a href="https://www.php.net/manual/ja/language.generators.php">PHPマニュアル 言語リファレンス ジェネレータ</a></li>
    </ul>
  </footer>
</body>

</html>