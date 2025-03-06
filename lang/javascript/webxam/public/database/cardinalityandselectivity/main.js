/**
 * @fileoverview カーディナリティや選択率を調べるためのスクリプト
 */

const getStat = async ({ statName, tableInfo }) => {
  const response = await fetch(`/brest/dbapi/${statName}/`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tableInfo) 
  })
  if (!response.ok) {
    throw new Error(`ERROR: ${response.statusText}`)
  }
  const results = await response.json()
  return results
}

// DOM

const listenres = {
  getCardinality: async () => {
    const table = document.getElementById('cardinalityTable').value
    const column = document.getElementById('cardinalityColumn').value
    const results = await getStat({
      statName: 'cardinarity', 
      tableInfo: {
        table, 
        columns: column.split(',')
      }
    })
    const output = document.querySelector('.cardinarity .output')
    output.textContent = JSON.stringify(results)
  },
  getSelectivity: async () => {
    const table = document.getElementById('selectivityTable').value
    // TODO: 選択条件をそのまま渡さないようにしたい。
    const condition = document.getElementById('selectivityCondition').value
    const results = await getStat({
      statName: 'selectivity', 
      tableInfo: {
        table, condition
      }
    })
    const output = document.querySelector('.selectivity .output')
    output.textContent = JSON.stringify(results)
  }
}

const init = () => {
  document.querySelector('main').addEventListener('click', async event => {
    const { eventListener } = event.target.dataset
    await listenres?.[eventListener]()
  })
}

init()
