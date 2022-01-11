/**
 * @fileoverview オブジェクトの振る舞いや関連する関数を調査するためのスクリプト
 */

class Book {
  constructor(name) {
    this.name = name;
  }
}

const getSampleObj = () => {
  const originalObj = {
    name: 'Mike',
    score: {
      math: 90,
      chemistry: 80
    },
    greet: () => 'Hello',
    book: new Book('ももたろう')
  };
  return originalObj;
};

const funcs = {
  load: {
    shallowCopy: () => {
      const output = document.querySelector(`.output[data-event-output='shallowCopy']`);
      const originalObj = getSampleObj();
      const shallowCopyObj = { ...originalObj };
      shallowCopyObj.age = 21;
      output.innerHTML += `[追加]originalObj.age = ${originalObj.age}<br />`;
      shallowCopyObj.score.geography = 65;
      output.innerHTML += `[更新]originalObj.score.geography = ${originalObj.score.geography}<br />`;
      output.innerHTML += `shallowCopyObj.greet() = ${shallowCopyObj.greet()}<br />`;
      output.innerHTML += `shallowCopyObj.book.name = ${shallowCopyObj.book.name}<br />`;
    },
    deepCopy: () => {
      const output = document.querySelector(`.output[data-event-output='deepCopy']`);
      const originalObj = getSampleObj();
      const deepCopyObj = JSON.parse(JSON.stringify(originalObj));
      deepCopyObj.age = 21;
      output.innerHTML += `[追加]originalObj.age = ${originalObj.age}<br />`;
      deepCopyObj.score.geography = 65;
      output.innerHTML += `[更新]originalObj.score.geography = ${originalObj.score.geography}<br />`;
      output.innerHTML += `deepCopyObj.greet() = ${deepCopyObj.greet && deepCopyObj.greet()}<br />`;
      output.innerHTML += `deepCopyObj.book.name = ${deepCopyObj.book?.name}<br />`;
    },
    /**
     * structuredClone()はクローンできないプロパティが見つかれば失敗させてくれるので気づかないうちに
     * 不適切なクローンが作られる心配はない。その意味で JSON.parse(JSON.stringify(obj)); よりも安全と
     * 言える。
     */
    structuredClone: () => {
      const output = document.querySelector(`.output[data-event-output='structuredClone']`);
      const originalObj = getSampleObj();
      // クローンを失敗させるプロパティを削除する。
      delete originalObj.greet;
      const structuredCloneObj = structuredClone(originalObj);
      structuredCloneObj.age = 21;
      output.innerHTML += `[追加]originalObj.age = ${originalObj.age}<br />`;
      structuredCloneObj.score.geography = 65;
      output.innerHTML += `[更新]originalObj.score.geography = ${originalObj.score.geography}<br />`;
      output.innerHTML += `structuredCloneObj.greet() = エラー回避のため削除<br />`;
      output.innerHTML += `structuredCloneObj.book.name = ${structuredCloneObj.book?.name}<br />`;
    }
  },
  click: {
    // Does nothing
  }
};

const addListener = () => {
  const main = document.querySelector('main');
  main.addEventListener('click', event => {
    // Does nothing
  });

  window.addEventListener('DOMContentLoaded', () => {
    Object.values(funcs.load).forEach(f => f());
  });
};

addListener();
