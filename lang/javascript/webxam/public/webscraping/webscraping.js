/**
 * @fileoverview webscrapiungコンテキストを利用するサンプルWebアプリ共通の
 * 機能をまとめたスクリプトです。
 */

const BASE_URL = '/brest/webscraping/'

class WSError extends Error {
  constructor(message) {
    super(message)
  }
}

class WSHttpError extends WSError {
  constructor(resourceName, status) {
    super(`WebScraping API [${resourceName}] Http Error ${status}`)
    this.resourceName = resourceName
  }
}

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
    throw new WSHttpError(resourceName, response.status)
  }
  const json = await response.json()
  return json[propName]
}

const wsInit = (initFuncs) => {
  Object.values(initFuncs).forEach(async listener => await listener())
}

export {
  wsInit,
  wsGet
}
