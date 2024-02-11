/**
 * 参考:
 * 「ハンズオンWebAssembly」P.95
 * コンパイル例
 * emcc side_module.c -g -O1 --no-entry -s "EXPORTED_FUNCTIONS=['_increment']" -o side_module.wasm
 **/

int increment(int value) {
  return ++value;
}
