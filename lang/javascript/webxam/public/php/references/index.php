<?php

declare(strict_types=1);
?>
<!DOCTYPE html>
<html lang="ja">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>リファレンス</title>
  <link rel="stylesheet" href="../../common.css" />
</head>

<body>
  <header>
    <a href="../../">home</a>
    <h1>リファレンス</h1>
  </header>

  <main>
    <section>
      <h2>リファレンス代入とリファレンス渡し</h2>
      <?php 
      function incNumber(int &$number): void {
        $number++;
      }
      $number = 100;
      $ref_number = &$number;
      incNumber($number); // 渡す側に&は不要。
      echo '$number=', $number, ', $ref_number=', $ref_number, '<br />';
      ?>
    </section>
    <section>
      <h2>リファレンスを返す</h2>
      <p>不可解なバグや読みづらさに繋がるので安易に使うべきではない。</p>
      <?php 
      class Member {
        function __construct(string $name = 'no name') {
          $this->name = $name;
        }

        function &get_name() {
          // 返す値を指す変数自体に&は不要。
          // readonlyなプロパティだとエラーになる。
          return $this->name; 
        }
      }

      $member = new Member($name = 'Mike');
      $member_name = &$member->get_name();
      // get_name()からリファレンスが返されて$member_nameに代入されているため
      // $nameへの変更の影響が$member_nameにも及ぶ。
      $member->name = 'HogeHoge';

      echo $member_name, '<br />';
      ?>
    </section>
    <section>
      <h2>リファレンスの削除</h2>
      <?php 
      $sample_name = &$member_name;
      // 変数自体が未定義の状態に戻る。この状態で参照するとエラーになる。
      unset($member_name);
      try {
        // $member_nameが削除されてもリファレンス代入先の$sample_nameでは
        // $member_nameと同じ内容が参照できる。
        echo '$sample_name=', $sample_name, '<br />';
      } catch (LogicException $e) {
        echo $e->getMessage();
      }
      ?>
    </section>
  </main>

  <footer>
    <h3>参考</h3>
    <ul>
      <li><a href="https://www.php.net/manual/ja/language.references.php">PHPマニュアル 言語リファレンス リファレンス</a></li>
    </ul>
  </footer>
</body>

</html>