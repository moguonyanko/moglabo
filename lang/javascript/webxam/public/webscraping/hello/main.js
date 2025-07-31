/**
 * @fileoverview WebスクレイピングのAPIを提供するWebサービスが
 * 正常に動作しているかどうかを確認するためのスクリプト
 */

const getHello = async () => {
  const api_url = '/brest/webscraping/hellowebscraping/'
  const response = await fetch(api_url, {
    method: 'GET'
  })
  if (!response.ok) {
    throw new Error(`HTTP REQUEST ERROR:${response.statusText}`)
  }
  const { message } = await response.json()
  return message
}

const init = async () => {
  const message = await getHello()
  const date = new Date().toString()
  const output = document.querySelector('.output')
  output.textContent = `${date}:${message}`
}

Promise.all([init()])
