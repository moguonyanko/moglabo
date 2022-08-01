<!DOCTYPE html>
<html lang="ja">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>画像処理および作成</title>
  <link rel="stylesheet" href="../../common.css" />
  <script src="main.js" defer></script>
</head>

<body>
  <header>
    <a href="../../">home</a>
    <h1>画像処理および作成</h1>
  </header>
  <main>
    <section>
      <h2>サポートしている画像フォーマット一覧</h2>
      <?php 
      echo '<ul>';
      foreach (gd_info() as $key => $value) {
        echo "<li>$key : ", is_bool($value) ? ($value ? 'サポート' : '未サポート') : $value, "</li>";
      }
      echo '</ul>';
      ?>
    </section>
    <section>
      <h2>imagepng</h2>
      <div class="output imagepng"></div>
    </section>
  </main>
  <footer>
    <h3>参考</h3>
    <ul>
      <li><a href="https://www.php.net/manual/ja/refs.utilspec.image.php">PHPマニュアル 画像処理および作成</a></li>
      <li><a href="https://www.php.net/manual/ja/ref.image.php">GD および Image 関数</a></li>
    </ul>
  </footer>
</body>

</html>