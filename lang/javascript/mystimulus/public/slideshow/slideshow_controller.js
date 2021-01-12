/**
 * @fileoverview スライドショーのスクリプト
 * 状態管理を調査するのが目的である。
 * https://stimulus.hotwire.dev/handbook/managing-state
 */

const application = Stimulus.Application.start()

class SlideComponent extends Stimulus.Controller {

  static targets = ['slide']

  #index = 0

  // コンストラクタとは異なるタイミングで呼び出される。
  initialize() {
    this.#index = parseInt(this.element.dataset.index)
    this.showCurrentSlide()
  }

  next() {
    if (this.#index + 1 < this.length) {
      this.#index++
      this.showCurrentSlide()
    }
  }

  previous() {
    if (this.#index - 1 >= 0) {
      this.#index--
      this.showCurrentSlide()
    }
  }

  get length() {
    return this.slideTargets.length
  }

  showCurrentSlide() {
    this.slideTargets.forEach((slideElement, index) => {
      const invisibleCls = 'invisible'
      if (index === this.#index) {
        slideElement.classList.remove(invisibleCls)
      } else {
        slideElement.classList.add(invisibleCls)
      }
    })
  }

}

application.register("slideshow", SlideComponent)
