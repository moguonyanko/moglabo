/**
 * @fileoverview WebAssemblyをNode.jsでデバッグ及びテストするためのスクリプト
 */
/* eslint-env node */

const SideModule = require('./webassembly/side_module/side_module.js')

const test_increment = () => {
  let max = 3
  let n = 0
  for (let i = 0; i < max; i++) {
    n = SideModule.increment()
  }
  if (n !== max - 1) {
    throw new Error(`${n} != ${max - 1}`)
  }
}

const tests = [
  test_increment
]

Object.values(tests).forEach(fn => fn())
