<?php

declare(strict_types=1);
?>
<!DOCTYPE html>
<html lang="ja">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>列挙型</title>
  <link rel="stylesheet" href="../../common.css" />
</head>

<body>
  <header>
    <a href="../../">home</a>
    <h1>列挙型</h1>
  </header>

  <main>
    <section>
      <h2>Enumの比較</h2>
      <p>Pure Enum(各caseがスカラー値を持っていない)</p>
      <pre>
      enum Janken {
        case ROCK;
        case PAPER;
        case SCISSORS;
      }
      </pre>
      <p>Enumはシングルトンなので===で比較して問題ない。</p>
      <?php 
      enum Janken {
        case ROCK;
        case PAPER;
        case SCISSORS;
      }
      // Enumはシングルトン
      $janken1 = Janken::ROCK;
      $janken2 = Janken::ROCK;
      echo var_dump($janken1 === $janken2), '<br />';
      print '<p>Janken::PAPER->name:'.Janken::PAPER->name.'</p>';
      ?>
      <p>Backed Enum(各caseがスカラー値を持っている)</p>
      <pre>
      enum KenKen: int {
        case GURIKO = 5;
        case CHOCOLATE = 9;
        case PARACHUTE = 10; // スカラー値が衝突するとエラー
      }
      </pre>
      <?php
      enum KenKen: int {
        case GURIKO = 5;
        case CHOCOLATE = 9;
        case PARACHUTE = 10; // スカラー値が衝突するとエラー

        // __toString()を実装することはできない。
        // function __toString() {
        //   return $this->name;
        // }
      }

      print 'KenKen::PARACHUTE->value:'.KenKen::PARACHUTE->value.'<br />';

      echo '<p>', KenKen::from(9)->name, '</p>';
      echo '<p>', KenKen::tryFrom(-1) ?? KenKen::GURIKO->name, '</p>';
      ?>
    </section>
    <section>
      <h2>列挙型とメソッド</h2>
      <?php 
      class Dimension {
        function __construct(readonly int $width, readonly int $height) {
        }

        function __toString() {
          return "{$this->width}x{$this->height}";
        }
      }

      interface Display {
        function get_size(): Dimension;
      }
      
      // トレイトなら$thisを参照できるユーティリティ関数群が作れる？
      // ただし$thisが期待した型でなければ(トレイトが期待した型の内部で使用されなければ)エラーとなる。
      trait Maker {
        function get_maker_name(): string {
          return match($this) {
            MobileDevice::MyPhone, MobileDevice::MyPad => 'Myapple',
            MobileDevice::Myandroid => 'GooGoo',
            default => 'Unknown'
          };
        }
      }

      // 列挙型の各要素と関連づける値はstringかintでなければならない。
      enum MobileDevice implements Display {

        use Maker;

        case MyPhone;
        case Myandroid;
        case MyPad;
        case MyGarake;

        const Huge = self::MyPad;
        // 以下でも同じ。
        //const Huge = MobileDevice::MyPad;

        function get_size(): Dimension {
          return match($this) { // $thisを参照していないが$thisを引数に取らないとマッチできない。
            MobileDevice::MyPhone, MobileDevice::Myandroid => new Dimension(400, 700),
            MobileDevice::MyPad => new Dimension(850, 1000),
            MobileDevice::MyGarake => new Dimension(300, 550)
          };
        }

        static function from_amount_range(string $range_word): static {
          $w = strtoupper($range_word);
          return match(true) {
            $w === 'SMALL' => static::MyGarake,
            $w === 'MIDDLE' => static::MyPhone,
            $w === 'BIG' => static::Myandroid,
            default => static::MyPad
          };
        }

        // 上記と同じ結果を返す。
        // static function from_amount_range(string $range_word): MobileDevice {
        //   $w = strtoupper($range_word);
        //   return match(true) {
        //     $w === 'SMALL' => MobileDevice::MyGarake,
        //     $w === 'MIDDLE' => MobileDevice::MyPhone,
        //     $w === 'BIG' => MobileDevice::Myandroid,
        //     default => MobileDevice::MyPad
        //   };
        // }
      }

      echo '<p>', var_dump(MobileDevice::cases()), '</p>';
      print MobileDevice::MyGarake->name.'='.MobileDevice::MyGarake->get_size();
      $sampledevice = MobileDevice::from_amount_range('おすすめ');
      echo '<p>おすすめは', $sampledevice->name, '</p>';
      echo '<p>メーカーは', $sampledevice->get_maker_name(), '</p>';
      ?>
    </section>
  </main>

  <footer>
    <h3>参考</h3>
    <ul>
      <li><a href="https://www.php.net/manual/ja/language.enumerations.php">PHPマニュアル 言語リファレンス 列挙型</a></li>
    </ul>
  </footer>
</body>

</html>