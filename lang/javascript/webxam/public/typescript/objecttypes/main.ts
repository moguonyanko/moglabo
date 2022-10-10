/**
 * @fileoverview オブジェクト調査用スクリプト
 * 他のディレクトリにあるtsファイルで宣言した変数と同じ名前で変数宣言すると衝突してしまう。
 * スクリプトをtype="module"で記述していてもコンパイルエラーになる。
 */

interface MyNote {
  message: string;
}

interface ReadonlyMyNote {
  readonly message: string;
}

interface MyDict {
  // readonlyにすると添字を指定した値の設定もエラーになる。
  [index: number]: string;
}

const init = (): void => {
  Object.values({
    readonlyproperties: (): void => {
      const writableNote: MyNote = { message: 'Hello' };
      const readonlyNote: ReadonlyMyNote = writableNote;
  
      const output = document.querySelector('.example.readonlyproperties .output');
      output!.innerHTML += `ReadonlyMyNote:${readonlyNote.message}<br />`;
      // 書き換え可能なオブジェクトからの参照経由ではreadonlyなプロパティであっても
      // 変更できてしまう。
      writableNote.message += ' My World!';
      output!.innerHTML += `ReadonlyMyNote:${readonlyNote.message}`;
    },
    indexsignatures: (): void => {
      const dict: MyDict = [];
      dict[0] = 'Hello';
      // string型しか値としては認められないためコンパイルエラーになる。
      //dict[1] = 100;
      dict[1] = 'World';
      const output = document.querySelector('.example.indexsignatures .output');
      output!.textContent = dict[0] + dict[1];
    }  
  }).forEach(f => f());
};

init();