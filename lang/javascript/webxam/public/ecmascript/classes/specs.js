/**
 * 参考:
 * https://github.com/tc39/proposal-class-static-block
 */

// この関数は公開しないようにする。
let getSpec;

export class SpecInfo {
  #spec;

  constructor(data) {
    this.#spec = { data };

    getSpec = (obj) => obj.#spec;
  }

  // 現在提案されているclass-static-block
  // static {
  //   getSpec = (obj) => obj.#spec;    
  // }
}

export function readData(specInfo) {
  return getSpec(specInfo).data;
}
