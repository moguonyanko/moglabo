/**
 * @fileoverview Navigation APIを試すためのスクリプトです。
 * 参考:
 * https://web.dev/blog/baseline-navigation-api?hl=en&authuser=3
 */

async function renderContent(path) {
  console.log(`Rendering UI for: ${path}...`)

  const rendaringArea = document.getElementById('rendering-area')
  rendaringArea.innerHTML = ''
  const response = await fetch(path)
  const html = await response.text()
  rendaringArea.innerHTML = html
}

navigation.addEventListener('navigate', event => {
  console.log(event)
  const url = new URL(event.destination.url)

  event.intercept({
    async handler() {
      await renderContent(url.pathname)
    }
  })
})

const addListeners = () => {
  const main = document.querySelector('main')
  main.addEventListener('click', event => {
    const { navigatable } = event.target.dataset
    if (Boolean(navigatable)) {
      // NavigationAPIを使うとしてもpreventDefaultはしないと複数回イベントが発生する。
      event.preventDefault()
      // event.stopPropagation()
      navigation.navigate(event.target.href)
    }
  })
}

addListeners()
