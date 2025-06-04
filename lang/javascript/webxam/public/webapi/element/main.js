/**
 * @fileoverview HTML要素の調査用スクリプト
 */

// DOM

const toggleMoveTarget = type => {
  const funcName = type.toLowerCase() === 'move' ? 'moveBefore' : 'insertBefore'
  const target1 = document.querySelector('.output.target-1 .sampleMoveTarget')
  const target2 = document.querySelector('.output.target-2 .sampleMoveTarget')
  if (target1) {
    // 第2引数はmoveBeforeでもinsertBeforeでも省略不可能。
    document.querySelector('.output.target-2')[funcName](target1, null)
  } else {
    document.querySelector('.output.target-1')[funcName](target2, null)
  }
}

/**
 * 特定の構造を含むdialogを提供したいのでbuild-in elementではなく
 * 通常のHTMLElementを継承している。
 */
class FavLangDialog extends HTMLElement {
  constructor() {
    super()

    const shadow = this.attachShadow({ mode: 'open' })
    const template = document.getElementById('fav-lang-dialog')
    if (template) {
      const clone = template.content.cloneNode(true)
      shadow.appendChild(clone)
    } else {
      console.warn('fav-lang-dialog template not found')
    }
  }

  appendDialogEventMessage(message) {
    const langInfo = document.createTextNode(message)
    this.output.appendChild(langInfo)
    this.output.appendChild(document.createElement('br'))
  }

  appendCancelEventMessage(message) {
    this.appendDialogEventMessage(`cancelイベント発生:${message}`)
  }

  // built-inのCustomElementではないので、showModalは独自に実装する必要がある。
  // close, requestCloseは外部から呼び出すことはないので実装していない。

  /**
   * CustomElementのコンストラクタは引数としてoutputを受け取ることはできないので、
   * showModalメソッドでoutputを受け取る。
   * @param {HTMLElement} output 
   */
  showModal(output) {
    this.output = output
    const dialog = this.shadowRoot.querySelector('dialog')
    if (dialog) {
      dialog.showModal()
    } else {
      console.error('Dialog element not found in shadow DOM')
    }
  }

  // close() {
  //   const dialog = this.shadowRoot.querySelector('dialog')
  //   if (dialog) {
  //     dialog.close()
  //   } else {
  //     console.error('Dialog element not found in shadow DOM')
  //   }
  // }

  // requestClose(reason) {
  //   const dialog = this.shadowRoot.querySelector('dialog')
  //   if (dialog) {
  //     dialog.requestClose(reason)
  //   } else {
  //     console.error('Dialog element not found in shadow DOM')
  //   }
  // }

  connectedCallback() {
    const dialog = this.shadowRoot.querySelector('dialog')

    // submit以外が指定されたボタンをクリックした時に、requestCloseが呼び出されると
    // cancelイベントが発生する。ただし2025/06/03時点のFirefoxNightlyでは、
    // cancelイベントは発生しない。
    // cancelするかどうかを決定できるイベントなのでcancelableイベントの方が妥当な名称なのではないか？
    dialog.addEventListener('cancel', event => {
      console.log(event)
      if (!event.cancelable) {
        return
      }
      const baseMessage = 'cancelイベント発生'
      const selectedLang = dialog.querySelector('#favlang').value
      if (selectedLang) { // cancelせずダイアログのcloseへ移行する。
        this.appendCancelEventMessage(selectedLang)
      } else { // ダイアログのcloseをcancelする。
        event.preventDefault()
        this.appendCancelEventMessage('言語を何か選択して下さい')
        this.dispatchEvent(new CustomEvent('dialogcloseerror', {
          composed: true,
          bubbles: true,
          detail: {
            message: '言語を何か選択して下さい'
          }
        }))
      }
    })

    // dialog.getElementByIdは未定義である。
    const closeButton = dialog.querySelector('#closeButton')
    closeButton.addEventListener('click', () => {
      // cancelイベントを発生させた後、closeイベントを発生させてダイアログを閉じることができる。
      // ただし引数に渡した値がcloseイベントに渡されることはない。
      dialog.requestClose("request close")
    })

    dialog.addEventListener('close', event => {
      console.log(event)
      this.appendDialogEventMessage('closeイベント完了')

      this.dispatchEvent(new CustomEvent('dialogclose', {
        composed: true,
        bubbles: true,
        detail: {
          message: 'ダイアログが閉じられました'
        }
      }))
    })
  }

  disconnectedCallback() {
    // ダイアログが削除された時の処理
    console.log('FavLangDialog disconnected')
  }
}

const funcs = {
  openDialog: () => {
    const dialog = document.getElementById('inertTestDialog');
    dialog.showModal();
    const main = document.querySelector('main');
    main.setAttribute('inert', 'true');
  },
  closeDialog: () => {
    const dialog = document.getElementById('inertTestDialog');
    dialog.close();
    const main = document.querySelector('main');
    main.removeAttribute('inert');
  },
  controlUntilfound: () => {
    const src = document.querySelector(`[data-event-target='controlUntilfound']`);
    document.querySelectorAll('.untilfound').forEach(el => {
      if (src.checked) {
        el.setAttribute('hidden', 'until-found');
      } else {
        el.removeAttribute('hidden');
      }
    });
  },
  doAnimation: () => {
    const sampleBox = document.querySelector('.animation .samplebox')
    sampleBox.animate([
      // { transform: 'rotate(0) scale(1)' }, // 開始状態の指定は必須ではない。
      { transform: 'rotate(360deg) scale(0)' }
    ],
      {
        duration: 1000,
        iterations: 1
      })
  },
  doPick: () => {
    const sourceSelect = document.querySelector('select[data-event-pick-source="doPick"]')
    sourceSelect.showPicker()
  },
  doMoveBefore: () => {
    toggleMoveTarget('moveBefore')
  },
  doInsertBefore: () => {
    toggleMoveTarget('insertBefore')
  },
  showDialog: () => { 
    const base = document.querySelector('.request-close')
    const output = base.querySelector('.output')
    output.textContent = ''
    const dialog = document.createElement('fav-lang-dialog')
    base.appendChild(dialog)
    
    dialog.addEventListener('dialogclose', event => {
      base.removeChild(dialog)
      // output.textContent = event.detail.message
    })

    dialog.addEventListener('dialogcloseerror', event => {
      alert(event.detail.message)
    })

    dialog.showModal(output)
  }
};

const init = () => {
  document.body.addEventListener('click', event => {
    const { eventTarget } = event.target.dataset;
    if (eventTarget) {
      event.stopPropagation();
      if (typeof funcs[eventTarget] === 'function') {
        funcs[eventTarget]();
      }
    }
  });

  // TODO: beforematchイベントを発生させることができていない。
  // Chrome Canaryではbeforematchイベント自体は実装されている。  
  document.body.addEventListener('beforematch', event => {
    console.log(event);
  });

  customElements.define('fav-lang-dialog', FavLangDialog)
};

init();