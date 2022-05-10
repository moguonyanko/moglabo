<?php

declare(strict_types=1);
?>
<!DOCTYPE html>
<html lang="ja">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>サポートするプロトコルとラッパー</title>
  <link rel="stylesheet" href="../../common.css" />
  <!-- <script type="module" src="dataurl.js" defer></script> -->
</head>

<body>
  <header>
    <a href="../../">home</a>
    <h1>サポートするプロトコルとラッパー</h1>
  </header>

  <main>
    <section>
      <h2>glob://</h2>
      <?php 
      $iter = new DirectoryIterator('glob://./*.php');
      echo '<p>', var_dump($iter), '</p>';
      foreach ($iter as $f) {
        printf('<p>%s: %.1FKB</p>', $f->getFilename(), $f->getSize() / 1024);
      }
      ?>
    </section>
    <section>
      <h2>data://</h2>
      <img class="sampleimage" src="/webxam/image/hello.png" width="400" height="350" />
      <?php 
      // データ自体は echo -n HelloWorld | base64 で得た。
      $imgurl = 'data://text/plain;base64,SGVsbG9Xb3JsZA==';
      // 画像をDataURLにエンコードしたわけではないので表示できない。
      //echo '<img src="', $imgurl, '" />', '<br />';
      echo '<p>', file_get_contents($imgurl), '</p>';

      $sampleimageid = 'sampleimageurl';
      $script = <<<END
      <script>
        const img = document.querySelector('.sampleimage');  
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext('2d').drawImage(img, 0, 0);
        // OffscreenCanvasにはtoDataURLが実装されていない。
        const dataUrl = canvas.toDataURL();
        // console.log(dataUrl);
        const input = document.createElement('input');
        input.id = "$sampleimageid";
        input.type = 'hidden';
        input.value = dataUrl;
        document.body.appendChild(input);
      </script>
      END;

      echo $script;

      $doc = new DOMDocument();
      $doc->validateOnParse = true;
      // TODO: input要素が取得できていない。このタイミングでの要素取得は不可能なのか？
      $element = $doc->getElementById('sampleimagedataurl');
      try {
        $imgurl2 = 'data://image/png;base64,'.$element->getAttribute('value');
        echo '<img src=">', file_get_contents($imgurl2), '" />';
      } catch(Error) {
        echo "<p>$sampleimageid=", var_dump($element), '</p>';
      }
      ?>
    </section>
    <section>
      <h2>http://</h2>
      <?php 
      // httpsではエラーになる。openssl拡張モジュールが有効でないから？
      $sampleurl = 'http://localhost/webxam/';
      $fp = fopen($sampleurl, 'r');
      $meta_data = stream_get_meta_data($fp);

      foreach ($meta_data['wrapper_data'] as $response) {
        echo $response, '<br />';
      }
      ?>
    </section>
  </main>

  <footer>
    <h3>参考</h3>
    <ul>
      <li><a href="https://www.php.net/manual/ja/wrappers.php">PHPマニュアル 言語リファレンス サポートするプロトコル/ラッパー</a></li>
    </ul>
  </footer>
</body>

</html>