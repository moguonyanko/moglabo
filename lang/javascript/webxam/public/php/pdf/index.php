<?php

declare(strict_types=1);
?>
<!DOCTYPE html>
<html lang="ja">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>PDF</title>
  <link rel="stylesheet" href="../../common.css" />
</head>

<body>
  <header>
    <a href="../../">home</a>
    <h1>PDF</h1>
  </header>

  <main>
    <section>
      <h2>PDFの扱い</h2>
      <p>巨大なPDFを開けるかのテスト</p>
      <a href="sample_rect.pdf">sample_rect.pdf</a>
      <p>PHPには標準でPDFを生成するAPIは存在しないようだ。</p>
      <a href="openpdf.php?name=sample_rect.pdf">開くことはできる。</a>

      <div>
        <p>iframeでPDFを読み込むテスト</p>
        <iframe src="sample_rect.pdf" width="500" height="600">
          <a href="sample_rect.pdf">sample_rect.pdf</a>
        </iframe>
      </div>

      <p>以下のブラウザでは正常に開くことができた。</p>
      <ul>
        <li>iOS15.6.1 Safari</li>
        <li>macOS Safari16.1</li>
        <li>Chrome Canary</li>
        <li>Microsoft Edge 93.0.961.47</li>
      </ul>
      <p>以下は開けなかった。</p>
      <ul>
        <li>Firefox Nightly(PDF.jsの例外が発生する。)</li>
      </ul>
    </section>
  </main>

  <footer>
    <h3>参考</h3>
    <ul>
      <li><a href="https://www.geeksforgeeks.org/how-to-open-a-pdf-files-in-web-browser-using-php/">How to open a PDF files in web browser using PHP?</a></li>
    </ul>
  </footer>
</body>

</html>