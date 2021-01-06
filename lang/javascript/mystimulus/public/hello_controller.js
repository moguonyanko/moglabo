/**
 * @fileoverview Stimulus調査用アプリケーション
 *
 */

const application = Stimulus.Application.start()

class HelloComponent extends Stimulus.Controller {
  static targets = [ 'name', 'output' ]

  greet() {
    console.log(`Hello, ${this.name}!`)
    this.output()
  }

  output() {
    this.outputTarget.textContent = this.name
  }

  get name() {
    return this.nameTarget.value;
  }
}

application.register("hello", HelloComponent)
