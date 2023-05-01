/**
 * @fileoverview 各スクリプトの共通部品をまとめたクラスを定義します。
 */

class KyoPro {
  #runner = null;

  constructor(runner) {
    this.#runner = runner;
  }

  #addListener() {
    const main = document.querySelector('main');
    main.addEventListener('click', event => {
      if ('eventTrigger' in event.target.dataset) {
        event.stopPropagation();
        const args = document.querySelector('*[data-event-args]');
        const result = this.#runner.run(args.value);
        const output = document.querySelector('.output');
        output.innerHTML = result;
      }
    });  
  }

  start() {
    this.#addListener();
  }
}

export default KyoPro;
