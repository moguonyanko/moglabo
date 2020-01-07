/**
 * @fileoverview Module Worker調査用スクリプト
 * シンプルな計算機能を提供する。
 */

class MyMath {
  static add(a, b) {
    return a + b;
  }

  static pow({ base, pow }) {
    return Math.pow(base, pow);
  }
} 

export { MyMath };
