/**
 * @fileoverview dynamicLibraries配列の動作検証用スクリプト
 */

// ここで宣言するとemccで出力されたJSにこのスクリプトが取り込まれた際に
// Moduleの再宣言が発生して文法エラーになってしまう。
//const Module = window.Module;

Module['dynamicLibraries'] = ['calculate_primes.wasm'];
