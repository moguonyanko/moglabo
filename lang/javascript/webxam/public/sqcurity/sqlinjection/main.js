/**
 * @fileoverview SQLインジェクションを調べるためのスクリプトです。
 */

const requestSql = async sql => {
  const response = await fetch('/brest/gis/injectsql/', {
    method: 'POST',
    mode: 'cors',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sql
    })
  })
  if (!response.ok) {
    throw new Error(`ERROR:${response.status}:${response.statusText}`)
  }
  const { result } = await response.json()
  return result
}

// DOM

const funcs = {
  sendSql: async () => {
    const sql = document.getElementById('requestsql').value
    if (!sql) {
      return
    }
    const result = await requestSql(sql)
    const output = document.querySelector('.sendSql.output')
    output.value = result
  },
  clearSql: () => {
    document.getElementById('requestsql').value = ''
  }
}

const init = () => {
  const main = document.querySelector('main')
  main.addEventListener('click', async event => {
    const { eventFunction } = event.target.dataset
    if (typeof funcs[eventFunction] === 'function') {
      event.stopPropagation()
      await funcs[eventFunction]()
    }
  })
}

init()
