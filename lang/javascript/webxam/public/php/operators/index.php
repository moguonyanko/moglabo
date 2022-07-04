<?php

declare(strict_types=1);
?>
<!DOCTYPE html>
<html lang="ja">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>演算子</title>
  <link rel="stylesheet" href="../../common.css" />
</head>

<body>
  <header>
    <a href="../../">home</a>
    <h1>演算子</h1>
  </header>

  <main>
    <section>
      <h2>比較演算子</h2>
      <p>&lt&gtは型変換をした上で等しくない場合に真になる。</p>
      <div>
        <pre>
        $a = 100;
        $b = '100';
        </pre>
      </div>
      <?php
      $a = 100;
      $b = '100';
      $result = $a <> $b;
      echo '<p>$a &lt&gt $b = ', $result ? 'true' : 'false', '</p>';
      ?>
      <p>&lt=&gtは宇宙船演算子。完全一致する時に0が返される。</p>
      <div>
        <pre>
        $arr1 = ['1A' => 90, '2B' => 67];
        $arr2 = ['1A' => 90, '2B' => 67];
        $arr3 = ['1A' => 99, '2B' => 67];
        $arr4 = ['1A' => 90, '3C' => 67];
        </pre>
        <?php
        $arr1 = ['1A' => 90, '2B' => 67];
        $arr2 = ['1A' => 90, '2B' => 67];
        $arr3 = ['1A' => 99, '2B' => 67];
        $arr4 = ['1A' => 90, '3C' => 67];
        echo '<p>$arr1 &lt=&gt $arr2 = ', $arr1 <=> $arr2, '</p>';
        echo '<p>$arr1 &lt=&gt $arr3 = ', $arr1 <=> $arr3, '</p>';
        echo '<p>$arr1 &lt=&gt $arr4 = ', $arr1 <=> $arr4, '</p>';
        ?>
      </div>
    </section>
    <section>
      <h2>実行演算子</h2>
      <p>``で囲んだコマンドを実行できる。</p>
      <?php 
      $machine_name = `hostname`;
      echo 'マシン名:', "<strong>$machine_name</strong><br />";
      ?>
    </section>
    <section>
      <h2>論理演算子</h2>
      <p>orとandは=よりも優先順位が低いので代入が先に行われる。</p>
      <pre>
      $a1 = true || false;
      $a2 = true or false;
      $b1 = true && false;
      $b2 = true and false;
      </pre>
      <?php 
      $res = ['FALSE', 'TRUE'];

      $a1 = true || false;
      $a2 = true or false;

      echo '$a1=', $res[$a1], '<br />$a2=', $res[$a2], '<br />';

      $b1 = true && false;
      $b2 = true and false;
      
      echo '$b1=', $res[$b1], '<br /><strong>$b2=', $res[$b2], '</strong><br />';
      ?>
    </section>
    <section>
      <h2>配列演算子</h2>
      <p>
        ==は比較の際に型変換を伴う。要素の順番も考慮しない。<br />
        集合のように扱いたい配列に対しては有用かもしれないが型変換を勝手に行ってしまうのが邪魔である。
      </p>
      <pre>
      $arr5 = [0, 1, 2];
      $arr6 = [1, "2", false];</pre>
      <?php 
      $arr5 = [0, 1, 2];
      $arr6 = [false, 1, "2"];

      echo '$arr5 == $arr6 : ', $arr5 == $arr6 ? 'true' : 'false', '<br />';
      echo '$arr5 === $arr6 : ', $arr5 === $arr6 ? 'true' : 'false';
      ?>
      <p>+で配列を結合できる。左辺のキーの要素が優先される。右辺の要素で上書きされない。</p>
      <pre>
      $arr7 = ['Mike' => 24, 'Taro' => 45];
      $arr8 = ['Mike' => 80, 'Fuga' => 22];
      $arr7 += $arr8;</pre>
      <?php 
      $arr7 = ['Mike' => 24, 'Taro' => 45];
      $arr8 = ['Mike' => 80, 'Fuga' => 22];

      $arr7 += $arr8; // $arr7 = $arr7 + $arr8;と同じ。

      foreach ($arr7 as $key => $value) {
        echo $key, ':', $value, '<br />';
      }
      ?>
    </section>
    <section>
      <h2>エラー制御演算子</h2>
      <a href="https://www.php.net/manual/ja/language.operators.errorcontrol.php">参考ページ</a>
      <?php 
      $arr1 = ['a' => 1, 'b' => 2, 'c' => 3];
      try {
        echo '<p>'.$arr1['nothing'].'</p>';
      } catch (Throwable $e1) {
        // エラー時もこのブロックには遷移しない。
        echo '<p>エラー発生1</p>';
        echo '<p>'.var_dump($e1).'</p>';
      }
      echo '<p>@を先頭に付与するとエラーメッセージは無視される。</p>';
      try {
        echo '<p>'.@$arr1['ignore_message'].'</p>';
      } catch (Throwable $e2) {
        // エラーを無視してもしなくてもcatchブロックに処理が遷移しない。
        echo '<p>エラー発生2</p>';
        echo '<p>'.var_dump($e2).'</p>';
      }
      ?>
    </section>
  </main>

  <footer>
    <h3>参考</h3>
    <ul>
      <li><a href="https://www.php.net/manual/ja/language.operators.php">PHPマニュアル 言語リファレンス</a></li>
    </ul>
  </footer>
</body>

</html>