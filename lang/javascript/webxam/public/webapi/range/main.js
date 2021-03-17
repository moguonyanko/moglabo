/**
 * @fileoverview Range調査用スクリプト
 */

// DOM

const getSelectionText = () => {
  const text = [];
  const sel = self.getSelection();
  for (let i = 0; i < sel.rangeCount; i++) {
    const range = sel.getRangeAt(i);
    text.push(range.toString());
  }
  return text;
};

const displayBoundingClientRect = () => {
  const range = document.createRange();
  range.setStartBefore(document.querySelector('.range-start'));
  range.setEndAfter(document.querySelector('.range-end'));

  const rect = range.getBoundingClientRect();
  const container = document.querySelector('.output.bounding-client-rect');
  const box = document.createElement('div');
  box.classList.add('range');
  box.style.left = `${rect.x}px`;
  box.style.top = `${rect.y}px`;
  box.style.width = `${rect.width}px`;
  box.style.height = `${rect.height}px`;
  // テキストを折り返さないとgetBoundingClientRectから得られたサイズよりも
  // テキストの長さを優先して要素の幅が決定されてしまう。
  box.style.wordWrap = 'wrap';
  box.appendChild(document.createTextNode('Addtion Range Box'));
  container.appendChild(box);
};

let range, staticRange;

const createRanges = () => {
  const startContainer = document.querySelector('.range-container .range-diff-start'),
    endContainer = document.querySelector('.range-container .range-diff-end');
  range = document.createRange();
  range.setStart(startContainer, 0);
  range.setEnd(endContainer, 0);
  
  const spec = {
    startContainer: document.querySelector('.staticrange-container .range-diff-start'),
    startOffset: 0,
    endContainer: document.querySelector('.staticrange-container .range-diff-end'),
    endOffset: 0
  };
  staticRange = new StaticRange(spec);
};

const listener = {
  displaySelectionText: () => {
    const text = getSelectionText();
    const output = document.querySelector('.output.selection-text');
    output.textContent = text.join(',') || '未選択';
  },
  addElement: () => {
    const node = document.querySelector('.sample-node');
    range.selectNode(node);
    range.surroundContents(document.querySelector('.range-output'));
    
    try {
      // StaticRangeは変更するためのメソッドが実装されていないためエラーとなる。
      staticRange.selectNode(node);
      staticRange.surroundContents(document.querySelector('.staticrange-output'));
    } catch(err) {
      console.error(err.message);
    }
  }
};

const addListener = () => {
  document.body.addEventListener('pointerup', listener.displaySelectionText);
  
  const main = document.querySelector('main');
  main.addEventListener('click', event => {
    const { eventTarget } = event.target.dataset;
    if (eventTarget) {
      event.stopPropagation();
      if (typeof listener[eventTarget] === 'function') {
        listener[eventTarget]();  
      }
    }
  });
};

const init = () => {
  addListener();

  displayBoundingClientRect();
  createRanges();
};

init();