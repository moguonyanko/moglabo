/**
 * 参考:
 * 「ハンズオンWebAssembly」P.290〜
 * コンパイル例:
 * emcc main.cpp -s MAIN_MODULE=1 --pre-js ../../public/webassembly/dlopen/pre.js -s ERROR_ON_UNDEFINED_SYMBOLS=0 -o ../../public/webassembly/dlopen/index.html
 */

#include <cstdlib>
#ifdef __EMSCRIPTEN__
#include <dlfcn.h>
#include <emscripten.h>
#endif

#ifdef __cplusplus
extern "C" {
#endif

extern void findPrimes(int start, int end);

int main()
{
  findPrimes(3, 99);

  return 0;
}

#ifdef __cplusplus
}
#endif
