<?php

declare(strict_types=1);
?>
<!DOCTYPE html>
<html lang="ja">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>シリアライズ</title>
  <link rel="stylesheet" href="../../common.css" />
</head>

<body>
  <header>
    <a href="../../">home</a>
    <h1>シリアライズ</h1>
  </header>

  <main>
    <section>
      <h2>JSON</h2>
      <h3>json_decode</h3>
      <?php
      $sample = <<<END
        {
          "member": [
            {
              "name": "Mike",
              "age": 19
            },
            {
              "name": "Taro",
              "age": 43
            }
          ],
          "name": "テストチーム"
        }
        END;
      $my_team = json_decode($sample);
      echo $my_team->name, '<br />';
      echo '<ul>';
      foreach ($my_team->member as $mem) {
        echo '<li>', $mem->name, ':', $mem->age, '歳</li>';
      }
      echo '</ul>';
      ?>
      <h3>json_encode</h3>
      <?php
      class Member implements JsonSerializable
      {
        private $name;
        private $age;

        function __construct(string $name, int $age)
        {
          $this->name = $name;
          $this->age = $age;
        }

        public function jsonSerialize(): mixed
        {
          return [$this->name => $this->age];
        }
      }

      $member1 = new Member('Mike', 34);
      $member2 = new Member('Taro', 29);
      $member3 = new Member('Joe', 76);
      $json = json_encode([$member1, $member2, $member3], JSON_PRETTY_PRINT);
      echo $json;
      ?>
    </section>
  </main>

  <footer>
    <h3>参考</h3>
    <ul>
      <li><a href="https://www.php.net/manual/ja/book.json.php">JavaScript Object Notation</a></li>
    </ul>
  </footer>
</body>

</html>