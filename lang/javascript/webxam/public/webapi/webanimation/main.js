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

const initScrollTimeline = () => {
  const box = document.querySelector('.box')

  // TODO: コンテナ内でboxを回転させるようにしたい。
  const timeline = new ScrollTimeline({
    source: document.documentElement,
    // source: document.querySelector('.scrollTimeline .content'),
    axis: 'block' 
  })

  box.animate(  {
    rotate: ["0deg", "720deg"],
    left: ["0%", "100%"],
  },
  {
    timeline,
  })

  const output = document.querySelector('.scrollTimeline .output')
  output.innerHTML += `Timeline source element: ${timeline.source.nodeName}<br />`
  output.innerHTML += `Timeline scroll axis: ${timeline.axis}<br />`
}

const init = () => {
  initViewTimeline()
  initScrollTimeline()
}

init()
