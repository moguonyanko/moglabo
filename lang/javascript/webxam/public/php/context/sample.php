<?php

declare(strict_types=1);
?>
<!DOCTYPE html>
<html lang="ja">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sample</title>
  <link rel="stylesheet" href="../../common.css" />
</head>

<body>
  <main>
    <?php 
    $name = htmlspecialchars($_POST['columnname']);
    $value = htmlspecialchars($_POST['columnvalue']);
    // print var_dump($name);
    // print var_dump($value);
    
    // TODO: パラメータで置換されない。
    echo "<p>$name=$value</p>";
    ?>
  </main>
</body>

</html>