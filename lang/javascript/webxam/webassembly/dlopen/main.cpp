/**
 * 参考:
 * 「ハンズオンWebAssembly」P.278〜
 * コンパイル例:
 * emcc main.cpp -s MAIN_MODULE=1 -o ../../public/webassembly/dlopen/index.html
 */

#include <cstdlib>
#ifdef __EMSCRIPTEN__
#include <dlfcn.h>
#include <emscripten.h>
#endif

#ifdef __cplusplus
extern "C" {
#endif

typedef void(*FindPrimes)(int, int);

void calculatePrimes(const char* file_name) 
{
  void* handle = dlopen(file_name, RTLD_NOW);

  if (handle == NULL) 
  {
    return;
  }

  FindPrimes find_primes = (FindPrimes)dlsym(handle, "findPrimes");

  if (find_primes == NULL) 
  {
    return;
  }

  // calculate_primes.cppのmain関数と同じように素数検出を行う。
  find_primes(3, 100000);

  dlclose(handle);
}

int main()
{
  emscripten_async_wget(
    "calculate_primes.wasm", // wasmファイルへの相対パス
    "calculate_primes.wasm", // wasmファイルへ付ける名前
    calculatePrimes, // wasmファイルダウンロード成功時のコールバック関数
    NULL // wasmファイルダウンロード失敗時のコールバック関数
  );

  return 0;
}

#ifdef __cplusplus
}
#endif
