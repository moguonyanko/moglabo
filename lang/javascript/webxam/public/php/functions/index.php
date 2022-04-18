<?php

declare(strict_types=1);
?>
<!DOCTYPE html>
<html lang="ja">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>関数</title>
  <link rel="stylesheet" href="../../common.css" />
</head>

<body>
  <header>
    <a href="../../">home</a>
    <h1>関数</h1>
  </header>

  <main>
    <section>
      <h2>無名関数</h2>
      <?php
      $number = 1;

      $myfunc = function (int $x = 1) use ($number): int {
        return $number * $x;
      };

      $myreffunc = function (int $x = 1) use (&$number): int {
        return $number * $x;
      };

      echo "<p>", $myfunc(), "</p>";
      echo "<p>", $myreffunc(), "</p>";

      $number = 1000;

      echo "<p>", $myfunc(), "</p>"; // 関数定義時の$numberの値が使用される。つまり1。
      echo "<p>", $myreffunc(), "</p>"; // $numberの参照をuseすると宣言しているので変更後の$numberが表示される。
      ?>
      <h3>関数のバインド</h3>
      <?php
      // staticだとバインドできない。
      $myfunc2 = function (): string {
        echo 'バインドされたオブジェクト:', var_dump($this), '<br />';
        return 'Hello bindTo function';
      };

      $myfunc2 = $myfunc2->bindTo(new StdClass);
      echo '<p>', $myfunc2(), '</p>';
      ?>
    </section>
    <section>
      <h2>アロー関数</h2>
      <p>以下の二つは同じ意味になる。</p>
      <pre>
      function ($x) use ($y) { return $x + $y; };
      </pre>
      <pre>
      fn($x) =>  $x + $y;
      </pre>
      <?php
      $sampleword = 'Hello ';
      $samplenum = 1;

      $myfunc3_1 = function (string $word = 'My Function!') use (&$sampleword, &$samplenum): string {
        return $sampleword . $word . ($samplenum++);
      };

      // $samplewordを&$samplewordにするとエラーになってしまう。つまりmyfunc3_1と同じ振る舞いをさせることはできない。
      // 参照で変数をバインドできないのでアロー関数のスコープの外側の変数を変更できない。
      $myfunc3_2 = fn (string $word = 'My Function!'): string => $sampleword . $word . ($samplenum++);

      $sampleword = 'Oh! ';
      $samplenum++;

      echo '<p>', $myfunc3_1(), '</p>';
      echo '<p>', $myfunc3_2(), '</p>';

      class Sample {
        public function getMethod() {
          // 以下の書き方ではClosureを返すことはできない。doSampleを呼び出した結果が返される。
          // return $this->doSample();
          return Closure::fromCallable([$this, 'doSample']);
        }

        private function doSample(): string {
          return 'Do Sample!';
        }
      }

      $sampleObj = new Sample;
      $sampleMethod = $sampleObj->getMethod();
      var_dump($sampleMethod);
      echo '<p>', $sampleMethod(), '</p>';
      ?>
    </section>
  </main>

  <footer>
    <h3>参考</h3>
    <ul>
      <li><a href="https://www.php.net/manual/ja/language.functions.php">PHPマニュアル 言語リファレンス 関数</a></li>
    </ul>
  </footer>
</body>

</html>