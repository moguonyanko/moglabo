/**
 * @fileOverview Web Share API調査用スクリプト
 * @todo
 * ファイルの共有
 */

/**
 * public fieldやprivate fieldは未対応ブラウザが多いため意図的に使用していない。
 */
class ShareData {
  constructor( {url = location.href, text = '', files = [],
      title = document.title} = {}) {
    this.url = url;
    this.text = text;
    this.title = title;
    this.files = files;
  }
}

// DOM

const handlers = {
  async shareText(base) {
    // navigator.canShareが使える場合はそちらを使う方が好ましいと思われる。
    if (typeof navigator.share !== 'function') {
      throw new Error('Cannot use Web Share API');
    }
    const sampleText = base.querySelector('.sampletext').value;
    const shareData = new ShareData({text: sampleText});
    await navigator.share(shareData);
  }
};

const addListener = () => {
  document.querySelectorAll('section.example').forEach(baseElement => {
    baseElement.addEventListener('pointerup', async event => {
      const et = event.target.dataset.eventTarget;
      if (et) {
        event.stopPropagation();
        const handler = handlers[et];
        if (typeof handler === 'function') {
          try {
            await handler(baseElement);
          } catch (err) {
            // AbortErrorはデバッガーに伝搬しない。
            if (err instanceof DOMException && err.name === 'AbortError') {
              console.info(`Cancelled share oparation: ${err.message}`);
            } else {
              alert(err.message);
              throw err;
            }
          }
        }
      }
    });
  });
};

window.addEventListener('DOMContentLoaded', () => {
  addListener();
});
