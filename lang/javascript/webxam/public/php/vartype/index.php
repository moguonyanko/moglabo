<?php

declare(strict_types=1);
?>
<!DOCTYPE html>
<html lang="ja">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>変数・データ型関連</title>
  <link rel="stylesheet" href="../../common.css" />
  <!-- <script type="module" src="dataurl.js" defer></script> -->
</head>

<body>
  <header>
    <a href="../../">home</a>
    <h1>変数・データ型関連</h1>
  </header>

  <main>
    <section>
      <h2>配列のソート</h2>
      <p>値のソート</p>
      <?php 
      // constで宣言した配列はソートできない。
      $arr1 = [5, 8, 1, 6, 2];
      sort($arr1);
      echo '昇順：', var_dump($arr1), '<br />';
      rsort($arr1);
      echo '降順：', var_dump($arr1), '<br />';
      ?>
      <p>キーのソート</p>
      <?php 
      $arr2 = [
          'Mike' => 88,
          'Taro' => 78,
          'Peter' => 50,
          'Anko' => 40,
          'Foo' => 65          
      ];
      ksort($arr2);
      echo '昇順：', var_dump($arr2), '<br />';
      krsort($arr2);
      echo '降順：', var_dump($arr2), '<br />';
      ?>
      <p>ユーザー定義に従ってソート</p>
      <?php 
      class Member {
          function __construct(readonly int $id) {
          }
          
          function compare (Member $other): int {
              return $this <=> $other;
              // 上と同じ結果を返す。
              // return ($this->id < $other->id) ? -1 : 1;
          }
          
          static function comp(Member $a, Member $b): int {
              return $a->compare($b);
          }
          
          function __toString() {
              return (string)id;
          }
      }
      
      $arr3 = [ new Member(3), new Member(2), new Member(5), new Member(4), 
          new Member(1) ];
      
      function get_comp() {
          return function (Member $a, Member $b): int {
              return $a->compare($b);
          };
      }
      // 第2引数の関数は文字列かクロージャで指定しないとエラーとなる。
      usort($arr3, get_comp());
      // 上と同じ結果を返す。
      //usort($arr3, [Member::class, 'comp']);
      echo 'ユーザー定義：', var_dump($arr3), '<br />';
      ?>
    </section>
  </main>

  <footer>
    <h3>参考</h3>
    <ul>
      <li><a href="https://www.php.net/manual/ja/refs.basic.vartype.php">PHPマニュアル 関数リファレンス 変数・データ型関連</a></li>
    </ul>
  </footer>
</body>

</html>