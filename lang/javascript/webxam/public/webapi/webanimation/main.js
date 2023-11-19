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

const init = () => {
  initViewTimeline()
}

init()
