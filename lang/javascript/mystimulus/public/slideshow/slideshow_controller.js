/**
 * @fileoverview スライドショーのスクリプト
 * 状態管理を調査するのが目的である。
 * https://stimulus.hotwire.dev/handbook/managing-state
 */

const application = Stimulus.Application.start()

class SlideComponent extends Stimulus.Controller {

  static targets = ['slide']

  static values = {
    index: Number
  }

  next() {
    if (this.indexValue + 1 < this.length) {
      this.indexValue++
      this.showCurrentSlide()
    }
  }

  previous() {
    if (this.indexValue - 1 >= 0) {
      this.indexValue--
      this.showCurrentSlide()
    }
  }

  get length() {
    return this.slideTargets.length
  }

  indexValueChanged() {
    this.showCurrentSlide()
  }

  showCurrentSlide() {
    this.slideTargets.forEach((slideElement, index) => {
      const invisibleCls = 'invisible'
      if (index === this.indexValue) {
        slideElement.classList.remove(invisibleCls)
      } else {
        slideElement.classList.add(invisibleCls)
      }
    })
  }

}

application.register("slideshow", SlideComponent)
