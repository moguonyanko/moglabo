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

// Event

const displaySelectionText = event => {
  const text = getSelectionText();
  const output = document.querySelector('.output.selection-text');
  output.textContent = text.join(',') || '未選択';
};

const addListener = () => {
  document.body.addEventListener('pointerup', displaySelectionText);
};

const init = () => {
  addListener();

  displayBoundingClientRect();
};

init();