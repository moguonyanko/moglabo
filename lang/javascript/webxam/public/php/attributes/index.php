<?php

declare(strict_types=1);

use MySample\MySampleAttribtue;

?>
<!DOCTYPE html>
<html lang="ja">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>アトリビュート</title>
  <link rel="stylesheet" href="../../common.css" />
</head>

<body>
  <header>
    <a href="../../">home</a>
    <h1>アトリビュート</h1>
  </header>

  <main>
    <h2>アトリビュートの宣言とリフレクションによる操作</h2>
    <?php 
    include './mysampleattribute.php';

    #[MySampleAttribtue('Foo')]
    class Sample {}

    function dumpAttributes($ref) {
      $attrs = $ref->getAttributes();

      foreach ($attrs as $attr) {
        echo var_dump($attr->getName()), '<br />';
        echo var_dump($attr->getArguments()), '<br />';
        echo var_dump($attr->newInstance()), '<br />';
      }
    }

    dumpAttributes(new ReflectionClass(Sample::class));
    ?>
  </main>

  <footer>
    <h3>参考</h3>
    <ul>
      <li><a href="https://www.php.net/manual/ja/language.attributes.php">PHPマニュアル 言語リファレンス アトリビュート</a></li>
    </ul>
  </footer>
</body>

</html>