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
    const output = document.querySelector('.request-close .output')
    output.textContent = ''

    const dialog = document.getElementById('favDialog')
    dialog.showModal()

    const appendDialogEventMessage = message => {
      const langInfo = document.createTextNode(message)
      output.appendChild(langInfo)
      output.appendChild(document.createElement('br'))
    }

    const appendCancelEventMessage = message => {
      appendDialogEventMessage(`cancelイベント発生:${message}`)
    }

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
        appendCancelEventMessage(selectedLang)
      } else { // ダイアログのcloseをcancelする。
        event.preventDefault()
        appendCancelEventMessage('言語を何か選択して下さい')
        dialog.dispatchEvent(new Event('dialogcloseerror', {
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
      appendDialogEventMessage('closeイベント完了')
    })
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

    window.addEventListener('dialogcloseerror', event => {
      alert(event.detail.message)
    })
  });

  // TODO: beforematchイベントを発生させることができていない。
  // Chrome Canaryではbeforematchイベント自体は実装されている。  
  document.body.addEventListener('beforematch', event => {
    console.log(event);
  });
};

init();