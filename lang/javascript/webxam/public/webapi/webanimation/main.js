/**
 * @fileoverview Web Animation API調査用スクリプト
 */

const initViewTimeline = () => {
  const subject = document.querySelector('.viewTimeline .samplearea')
  const timeline = new ViewTimeline({
    subject
    // 要素のボックスがビュー内にあるかどうかを判定する際の位置を指定できる。
    // inset: [CSS.px('200'), CSS.px('300')]
  })

  subject.animate(
    {
      opacity: [0, 1],
      transform: ['scaleX(0)', 'scaleX(1)']
    },
    {
      fill: 'forwards', // fillは効いていない？
      timeline
    }
  )

  const output = document.querySelector('.viewTimeline .output')
  output.innerHTML += `Subject element: ${timeline.subject.nodeName}<br />`
  output.innerHTML += `start offset: ${timeline.startOffset}<br />`
  output.innerHTML += `end offset: ${timeline.endOffset}<br />`
}

/**
 * 対象の要素の見え方とは関係なくスクロール量に応じてアニメーションさせる。
 */
const initScrollTimeline = () => {
  const box = document.querySelector('.scrollTimeline .box')

  // TODO: コンテナ内でboxを回転させるようにしたい。
  const timeline = new ScrollTimeline({
    // source: document.documentElement,
    source: document.querySelector('.scrollTimeline .content'),
    axis: 'block' 
  })

  box.animate(  {
    rotate: ['0deg', '720deg'],
    left: ['0%', '100%']
  },
  {
    timeline,
  })

  const output = document.querySelector('.scrollTimeline .output')
  output.value += `Timeline source element: ${timeline.source.nodeName}\n`
  output.value += `Timeline scroll axis: ${timeline.axis}`
}

const init = () => {
  initViewTimeline()
  initScrollTimeline()
}

init()
