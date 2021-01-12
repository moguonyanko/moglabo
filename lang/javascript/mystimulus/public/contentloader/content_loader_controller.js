/**
 * @fileoverview 外部ファイル読み込みサンプル用スクリプト
 * 参考:
 * https://stimulus.hotwire.dev/handbook/working-with-external-resources
 * 外部HTMLのリクエストが蓄積してしまう不具合がある。
 * またrequestIntervalValueの値がsetIntervalで反映されていないように見える。
 */

const application = Stimulus.Application.start()

class ContentLoaderComponent extends Stimulus.Controller {

  static values = {
    url: String,
    refreshInterval: Number
  }

  // initialize() {
  //   if (this.hasRefreshIntervalValue) {
  //     this.startRefreshing()
  //   }
  // }

  async connect() {
    await this.load()
    if (this.hasRefreshIntervalValue) {
      this.startRefreshing()
    }
  }

  disconnect() {
    this.stopRefreshing()
  }

  async load() {
    // fetch(this.urlValue)
    // .then(response => response.text())
    // .then(html => this.element.innerHTML = html)
    const response = await fetch(this.urlValue)
    const html = await response.text()
    this.element.innerHTML = html
  }

  startRefreshing() {
    this.refreshTimer = setInterval(async () => {
      await this.load()
    }, this.requestIntervalValue)
  }

  stopRefreshing() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer)
      console.info('content-loader is disconnected')
    }
  }
}

const funcs = {
  disconnectContentLoader: () => {
    const controller = document.querySelector(`div[data-controller='content-loader']`)
    controller.parentNode.removeChild(controller)
  }
}

const main = () => {
  const main = document.querySelector('main')
  main.addEventListener('click', event => {
    const { eventTarget } = event.target.dataset
    funcs[eventTarget]?.()
  })

  application.register("content-loader", ContentLoaderComponent)
}

main()
