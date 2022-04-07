<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>はじめてのPHP</title>
    <link rel="stylesheet" href="../../common.css" />
    <link rel="stylesheet" href="main.css" />
</head>

<body>
    <header>
        <a href="../../">home</a>
        <h1>はじめてのPHP</h1>
    </header>
    <?php
    echo "<strong>こんにちは！はじめてのPHPスクリプトです！</strong>";
    ?>
    <div class="phpinfo">
        <?php phpinfo(); ?>
    </div>
    <footer>
        <h3>参考</h3>
        <ul>
            <li><a href="https://www.php.net/manual/ja/intro-whatis.php">PHP とはなんでしょう?</a></li>
        </ul>
    </footer>
</body>

</html>