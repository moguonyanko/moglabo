/**
 * @fileoverview 基本的な SPA ビュー遷移を試すためのスクリプト
 * 参考:
 * https://developer.mozilla.org/ja/docs/Web/API/View_Transition_API/Using#javascript_%E3%82%92%E6%B4%BB%E7%94%A8%E3%81%97%E3%81%9F%E7%8B%AC%E8%87%AA%E3%81%AE%E6%96%87%E6%9B%B8%E5%86%85_spa_%E9%81%B7%E7%A7%BB
 * https://mdn.github.io/dom-examples/view-transitions/spa/#
 */

let lastClick = {}

const getX = () => lastClick.x ?? innerWidth / 2

const getY = () => lastClick.y ?? innerHeight / 2

const getEndRadius = () => {
  const x = getX()
  const y = getY()
  const endRadius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y),
  )
  return endRadius
}

const doCustomTransition = () => {
  document.documentElement.animate(
    {
      clipPath: [
        `circle(0 at ${getX()}px ${getY()}px)`,
        `circle(${getEndRadius()}px at ${getX()}px ${getY()}px)`,
      ],
    },
    {
      duration: 500,
      easing: 'ease-in',
      pseudoElement: '::view-transition-new(root)',
    },
  )
}

const updateView = async event => {
  lastClick.x = event.clientX
  lastClick.y = event.clientY

  if (event.target.className === 'navlink') {
    event.stopPropagation()

    const displayNewPage = () => {
      const targetId = event.target.href.split('#')[1]
      const pages = document.querySelectorAll('.page')
      pages.forEach(page => {
        page.classList.remove('invisible')
        if (page.id !== targetId) {
          page.classList.add('invisible')
        }
      })
    }

    /**
     * startViewTransitionを挟むことでページ更新にアニメーションが加わる。
     */
    const transition = document.startViewTransition(() => displayNewPage())
    await transition.ready
    doCustomTransition()
  }
}

document.querySelector('main').addEventListener('click', updateView)
