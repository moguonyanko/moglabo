class TypeManager {
  static #TYPES = [
    'polygon', 'line', 'symbol', 'text'
  ];

  // 将来的には有効になるはずのstaticブロック
  // static {
  //   #TYPES = [
  //     'polygon', 'line', 'symbol', 'text'
  //   ];
  // }

  constructor () {
    // 以下ではTypeManagerのインスタンスを生成しないと#TYPESプロパティが
    // 正しく参照できる状態にならない。
    // this.#TYPES = [
    //   'polygon', 'line', 'symbol', 'text'
    // ];
  }

  static isSupported (obj) {
    return this.#TYPES.includes(obj.type.toLowerCase());
  }
}

export default TypeManager;
