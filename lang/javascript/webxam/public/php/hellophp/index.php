<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>はじめてのPHP</title>
    <link rel="stylesheet" href="../../common.css" />
    <link rel="stylesheet" href="main.css" />
    <script type="module" src="main.js" defer></script>
</head>

<body>
    <header>
        <a href="../../">home</a>
        <h1>はじめてのPHP</h1>
    </header>
    <?php
    echo "<strong>こんにちは！はじめてのPHPスクリプトです！</strong>";
    ?>
    <section class="info">
        <h2>PHPINFO</h2>
        <?php phpinfo(); ?>
    </section>
    <section class="info">
        <h2>UserAgent</h2>
        <?php
        if (strpos($_SERVER['HTTP_USER_AGENT'], 'Firefox') !== false) {
        ?>
            <p>Firefox表示中</p>
        <?php
        } else {
        ?>
            <p>Firefox以外のブラウザで表示中</p>
        <?php
        }
        ?>
    </section>
    <section>
        <h2>フォーム送信</h2>
        <form action="./action.php" method="POST">
            <label>name<input type="text" name="name" value="Taro" /></label>
            <label>age<input type="number" name="age" value="40" min="0" max="130" /></label>
            <button>送信</button>
        </form>
    </section>
    <footer>
        <h3>参考</h3>
        <ul>
            <li><a href="https://www.php.net/manual/ja/getting-started.php">PHPマニュアル</a></li>
        </ul>
    </footer>
</body>

</html>