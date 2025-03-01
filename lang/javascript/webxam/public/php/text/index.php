<?php

declare(strict_types=1);
?>
<!DOCTYPE html>
<html lang="ja">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>テキスト処理</title>
  <link rel="stylesheet" href="../../common.css" />
</head>

<body>
  <header>
    <a href="../../">home</a>
    <h1>テキスト処理</h1>
  </header>

  <main>
    <section>
      <h2>PCRE 正規表現 (Perl 互換)</h2>
      <section>
        <h3>preg_split</h3>
        <?php 
        const SUBJECT = 'Java PHP Perl Rust Swift JavaScript Python';
        $langs = preg_split('/[\s]+/', SUBJECT);
        print_r($langs);
        echo '<br />';
        $words = preg_split('/[\s]+/', SUBJECT, -1, PREG_SPLIT_OFFSET_CAPTURE);
        print_r($words);
        ?>
      </section>
      <section>
        <h3>preg_match</h3>
        <?php 
        // $matchesは宣言していなくても問題ない。
        preg_match('/(Java)/', SUBJECT, $matches, PREG_OFFSET_CAPTURE);
        print_r($matches);
        // 文字列が含まれるかどうかの判定を行いたいだけならstrposの方が高速で好ましい。
        print_r(strpos(SUBJECT, 'Ruby'));
        ?>
      </section>
      <section>
        <h3>preg_replace</h3>
        <?php 
        $sample = '999-9999-9999';
        // U修飾子で非貪欲モードに切り替えている。
        echo preg_replace('/(\d+)/U', '*', $sample), '<br />';
        ?>
      </section>
      <section>
        <h3>htmlspecialcharsとhtmlentities</h3>
        <div id="sampleformcontainer">
        <?php
        $samplehtmlform = <<<END
        <form action="/registermember" method="POST">
          <label>'年齢'
          <input type="number" name="age" value="20" min="0" max="150" /></label>
          <label>'名前'<input type="text" name="name" value="My Name `Mike`" /></label>
          <button disabled>送信 & 登録!</button>
        </form>
        END;
        echo '<p>Sample Form</p>';
        echo $samplehtmlform;
        echo '<p>htmlspecialchars</p>';
        echo htmlspecialchars('&, \', ", <, >'), '以外変換したくなければhtmlspecialcharsを使う。<br />';
        echo htmlspecialchars($samplehtmlform, ENT_QUOTES, encoding: 'UTF-8');
        echo '<p>htmlentities</p>';
        echo htmlentities($samplehtmlform, ENT_QUOTES, encoding: 'UTF-8');
        //var_dump(get_html_translation_table(HTML_ENTITIES, ENT_QUOTES | ENT_HTML5));
        ?>
        </div>
      </section>
      <section>
        <h3>str_getcsv</h3>
        <?php
        $filename = 'sample.csv';
        $handle = fopen($filename, 'r');
        $csv = fread($handle, filesize($filename));
        echo '<ul>';
        foreach (str_getcsv($csv) as $val) {
          echo '<li>', $val, '</li>';
        }
        echo '</ul>';
        fclose($handle);
        ?>
      </section>
      <section>
        <h3>JSON</h3>
        <p>json_decode</p>
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
        <p>json_encode</p>
        <?php 
        class Member implements JsonSerializable {
          private $name;
          private $age;

          function __construct(string $name, int $age) {
            $this->name = $name;
            $this->age = $age;
          }

          public function jsonSerialize(): mixed {
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
      <section>
        <h2>json_validate</h2>
        <?php
        $sample_json = '{"name": "Mike", "age": 30}';
        echo '<pre>', $sample_json, '</pre>';
        $json_validate_result = json_validate($sample_json) ? 'true' : 'false';
        echo "<p>json_validate={$json_validate_result}</p>";
        ?>
      </section>
    </section>
  </main>

  <footer>
    <h3>参考</h3>
    <ul>
      <li><a href="https://www.php.net/manual/ja/refs.basic.text.php">PHPマニュアル 関数リファレンス テキスト処理</a></li>
    </ul>
  </footer>
</body>

</html>