/**
 * @fileoverview JavaScriptモジュールインポートを試すためのスクリプトです。
 * 
 * **参考**
 * 
 * https://web.dev/blog/json-imports-baseline-newly-available?hl=en
 */

import membersJson from "./members.json" with { type: "json" };

const { members } = membersJson

const init = () => {
  const output = document.querySelector('.moduleImportSample .output')
  output.innerHTML = members.map(member => member.name).join(',')
}

init()
