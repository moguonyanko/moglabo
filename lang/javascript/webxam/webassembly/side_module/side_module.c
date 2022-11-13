/**
 * 参考:
 * 「ハンズオンWebAssembly」P.95
 * コンパイル例:
 * emcc side_module.c -O1 --no-entry -s "EXPORTED_FUNCTIONS=['_increment']" -o ../../public/webassembly/side_module/side_module.wasm
 **/

int increment(int value) {
  return ++value;
}
