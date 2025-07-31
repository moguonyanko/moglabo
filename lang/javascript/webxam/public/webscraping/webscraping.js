/**
 * @fileoverview webscrapiungコンテキストを利用するサンプルWebアプリ共通の
 * 機能をまとめたスクリプトです。
 */

const BASE_URL = '/brest/webscraping/'

const appendParams = (apiUrl, params) => {
  if (params && Object.keys(params).length > 0) {
    return `${apiUrl}?` + Object.entries(params)
      .map(([paramName, paramValue]) => `${paramName}=${paramValue}`)
      .join('&')
  } else {
    return apiUrl
  }
}

const wsGet = async ({resourceName, params, propName}) => {
  const apiUrl = `${BASE_URL}/${resourceName}/`
  const response = await fetch(appendParams(apiUrl, params), {
    method: 'GET'
  })
  if (!response.ok) {
    throw new Error(`HTTP REQUEST ERROR:${response.statusText}`)
  }
  const json = await response.json()
  return json[propName]
}

export {
  wsGet
}
