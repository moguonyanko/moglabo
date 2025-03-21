/**
 * @fileoverview SQLインジェクションを調べるためのスクリプトです。
 */

const requestSql = async sql => {
  const response = await fetch('/brest/dbapi/injectsql/', {
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
  const { results } = await response.json()
  return results
}

const formatResults = (results, lineSeparator) => {
  const lines = []
  for (let result of results) {
    lines.push(result.join(','))
  }
  return lines.join(lineSeparator)
}

// DOM

const getExplainCode = () => {
  const ctrls = document.querySelectorAll('.explainconrtrol input[type=radio]')
  const typeValue = Array.from(ctrls)
    .filter(ctrl => ctrl.checked)
    .map(ctrl => ctrl.value)[0]
  if (typeValue === 'analyze') {
    return 'EXPLAIN ANALYZE '
  } else if(typeValue === 'buffers') {
    return 'EXPLAIN (ANALYZE, BUFFERS) '
  } else if(typeValue === 'explain') {
    return 'EXPLAIN '
  } else {
    return ''
  }
}

const funcs = {
  sendSql: async () => {
    const sql = document.getElementById('requestsql').value
    if (!sql) {
      return
    }
    const results = await requestSql(`${getExplainCode()} ${sql}`)
    const output = document.querySelector('.sendSql.output')
    output.innerHTML = formatResults(results, '<br />')
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
