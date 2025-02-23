/**
 * @fileoverview scrollendイベントを調査するためのスクリプト
 */

const init = () => {
  // bodyやmain要素はscrollイベントやscrollendイベントを発生させない。
  const sampleArea = document.querySelector('.samplearea')
  sampleArea.addEventListener('scrollend', event => {
    const output = document.querySelector('.scrollendsample .output')
    output.innerHTML += `scrollend: ${new Date().getTime()}<br />`
  })
}

init()
