/**
 * @fileoverview React2Shell Security Example
 */

const rceTargetServers = {
  SimpleRseApp: 'http://localhost:8081/',
}

const SERVICE_BASE_URL = '/brest/security/poc/react2shell/'

const clicks = {
  onExecuteRce: async () => {
    const rceTargetApp = Array.from(document.querySelectorAll('input[name="rce-target-app"]'))
      .find(r => r.checked).value 
    const rceTargetUrl = rceTargetServers[rceTargetApp]

    const rceCommand = document.getElementById('rce-command').value

    if (!rceCommand || !rceTargetUrl) {
      return
    }

    const url = `${SERVICE_BASE_URL}command/`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: rceTargetUrl,
        command: rceCommand
      })
    })

    const { result } = await response.json()
    console.log(result)
    const output = document.querySelector('.react2shell-sample .output')
    output.textContent = JSON.stringify(result, null, 2)
  }
}

const init = () => {
  document.body.addEventListener('click', async event => {
    const { eventListener } = event.target.dataset
    if (eventListener && typeof clicks[eventListener] === 'function') {
      event.stopPropagation()
      try {
        event.target.setAttribute('disabled', 'disabled')
        await clicks[eventListener]()
      } finally {
        event.target.removeAttribute('disabled')
      }
    }
  })
}

init()
