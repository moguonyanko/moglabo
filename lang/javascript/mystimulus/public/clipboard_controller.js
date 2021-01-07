/**
 * @fileoverview Sitimulus Clipboard調査用スクリプト
 * Controllerのスクリプト名がdata-controller属性の値と一致している必要がある。
 * 参考:
 * https://stimulus.hotwire.dev/handbook/building-something-real
 */

const application = Stimulus.Application.start()

class CopyComponent extends Stimulus.Controller {
  // data-[Controller名]-target属性の値と一致させる。
  static targets = [ 'source' ]

  copy(event) {
    // a要素のhrefを参照してURLが変更されるといったデフォルトの動作を無効化する。
    event.preventDefault();
    this.sourceTarget.select();
    document.execCommand('copy');
  }
}

application.register("clipboard", CopyComponent)
