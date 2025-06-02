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
    const dialog = document.getElementById('favDialog')
    dialog.showModal()

    const submitButton = dialog.querySelector(`button[type=submit]`)
    dialog.addEventListener('cancel', event => {
      const closeableDialog = document.getElementById('closeableDialog').checked
      if (!closeableDialog) {
        event.preventDefault()
      }
    })

    const closeButton = dialog.querySelector('#closeButton')
    closeButton.addEventListener('click', () => {
      const selectedLang = dialog.querySelector('#favlang').value
      if (selectedLang) {
        // closeイベントを発生させてからダイアログを閉じることができる。
        dialog.requestClose("request close")
      } else {
        alert("Please select a language.")
      }
    })

    dialog.addEventListener('close', event => {
      console.log(event)
      if (event.reason) {
        console.log(`Dialog closed with reason: ${event.reason}`)
      }
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
  });

  // TODO: beforematchイベントを発生させることができていない。
  // Chrome Canaryではbeforematchイベント自体は実装されている。  
  document.body.addEventListener('beforematch', event => {
    console.log(event);
  });
};

init();