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
    <section>
      <h2>Ctype関数</h2>
      <p class="description">
        文字関連のテストに使う。高速なので正規表現などに頼るより好ましいらしい。
      </p>
      <p>ctype_digit</p>
      <?php 
      class DummyNumber {
          function __construct(readonly string $value) { }
      }
      $dummy = new DummyNumber('XXX');
      if (ctype_digit($dummy->value)) {
          // intvalは数値以外の文字列を受け取るとエラーではなくゼロを返してしまう。
          echo '<p>', intval($dummy->value), '</p>';
      } else {
          echo "数値ではありません: $dummy->value";
      }
      ?>
    </section>
    <section>
      <h2>filter_var()による検証</h2>
      <?php
      $email = 'sample@mymail.com';
      echo "'$email'はメールアドレスとして", 
              filter_var($email, FILTER_VALIDATE_EMAIL) ? '有効' : '無効', '<br />';
      
      $ipaddr = '10.10.10.300';
      echo "'$ipaddr'はIPアドレスとして", 
              filter_var($ipaddr, FILTER_VALIDATE_IP) ? '有効' : '無効', '<br />';
      
      $value = 55;
      $range = [
          'options' => [
              'min_range' => 0,
              'max_range' => 50
          ]
      ];
      echo "'$value'は範囲", filter_var($value, FILTER_VALIDATE_INT, $range) ? 
              '内' : '外';
      ?>
    </section>
    <section>
      <h2>filter_var()による除去</h2>
      <p>メールアドレスの場合空白と¥が除去される。</p>
      <?php
      $email2 = 'sama¥¥.-_Y-ple`sa  -   @  -   mymail.com';
      echo "'$email2' -> ", filter_var($email2, FILTER_SANITIZE_EMAIL);
      ?>
    </section>
    <section class="shutdownsample">
      <h2>register_shutdown_function()</h2>
      <p class="descrioption">
        PHPのスクリプト処理が完了した時に実行する関数を登録する。
        登録した関数はexit()を呼び出した場合も実行される。
      </p>
      <?php 
      function shutdownhook() {
          echo '<script>document.querySelector(".shutdownsample")'
          . '.appendChild(document.createTextNode("Shutdown!"));</script>';
      }
      
      register_shutdown_function('shutdownhook');
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
