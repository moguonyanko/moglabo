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
      throw new Error('Template for fav-lang-dialog not found')
    }
  }

  /**
   * ダイアログのCustomEventを作成するためのメソッド。
   * クラス外から参照される必要がないためprivateとして宣言している。
   * @param {Object} type, value, reasonを含むオブジェクト
   * typeはイベントの名称、valueは選択された言語、reasonはダイアログ終了時のエラー原因です。
   * @returns CustomEvent
   */
  static #createCustomDialogEvent({ type, value, reason }) {
    return new CustomEvent(`dialog${type}`, {
      composed: true,
      bubbles: true,
      detail: {
        value,
        reason
      }
    })
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
      throw new Error('Dialog element not found in shadow DOM')
    }
  }

  connectedCallback() {
    this.dispatchEvent(FavLangDialog.#createCustomDialogEvent({
      type: 'append'
    }))

    const dialog = this.shadowRoot.querySelector('dialog')

    // submit以外が指定されたボタンをクリックした時に、requestCloseが呼び出されると
    // cancelイベントが発生する。ただし2025/06/03時点のFirefoxNightlyでは、
    // cancelイベントは発生しない。
    // cancelするかどうかを決定できるイベントなのでcancelableイベントの方が妥当な名称なのではないか？
    dialog.addEventListener('cancel', event => {
      if (!event.cancelable) {
        return
      }
      const baseMessage = 'cancelイベント発生'
      const selectedLang = dialog.querySelector('#favlang').value
      if (selectedLang) { // cancelせずダイアログのcloseへ移行する。
        this.dispatchEvent(FavLangDialog.#createCustomDialogEvent({
          type: 'closestart',
          value: selectedLang
        }))
      } else { // ダイアログのcloseをcancelする。
        event.preventDefault()
        this.dispatchEvent(FavLangDialog.#createCustomDialogEvent({
          type: 'closecancel',
          reason: '言語を選択してください'
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
      this.dispatchEvent(FavLangDialog.#createCustomDialogEvent({
        type: 'closeend'
      }))
    })
  }

  disconnectedCallback() {
    this.dispatchEvent(FavLangDialog.#createCustomDialogEvent({
      type: 'remove'
    }))
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

    const appendDialogEventMessage = message => {
      const langInfo = document.createTextNode(message)
      output.appendChild(langInfo)
      output.appendChild(document.createElement('br'))
    }

    dialog.addEventListener('dialogappend', event => {
      console.log(event)
      appendDialogEventMessage('ダイアログが追加されました')
    })

    dialog.addEventListener('dialogremove', event => {
      console.log(event)
      appendDialogEventMessage('ダイアログが削除されました')
    })

    dialog.addEventListener('dialogclosestart', event => {
      console.log(event)
      appendDialogEventMessage(`選択言語:${event.detail.value}`)
      appendDialogEventMessage('ダイアログのcloseが開始されました')
    })

    dialog.addEventListener('dialogcloseend', event => {
      console.log(event)
      base.removeChild(dialog)
      appendDialogEventMessage('ダイアログのcloseが完了しました')
    })

    dialog.addEventListener('dialogclosecancel', event => {
      console.log(event)
      const {reason} = event.detail
      appendDialogEventMessage(`cancelイベント発生:${reason}`)
      alert(reason)
    })

    // dialogappendイベントを補足するにはイベントリスナーを追加した後にCustomElementを
    // DOMに追加する必要がある。
    base.appendChild(dialog)
    dialog.showModal()
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