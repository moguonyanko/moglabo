/**
 * @fileoverview カーディナリティや選択率を調べるためのスクリプト
 */

// DOM

const listenres = {
  getCardinality: async () => {
    const table = document.getElementById('cardinalityTable').value
    const column = document.getElementById('cardinalityColumn').value

    const response = await fetch('/brest/gis/cardinarity/', {
      method: 'POST',
      mode: 'cors',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        table,
        column
      }) 
    })
    const result = await response.json()
    const output = document.querySelector('.cardinarity .output')
    output.textContent = JSON.stringify(result)
  }
}

const init = () => {
  document.querySelector('main').addEventListener('click', async event => {
    const { eventListener } = event.target.dataset
    await listenres?.[eventListener]()
  })
}

init()
