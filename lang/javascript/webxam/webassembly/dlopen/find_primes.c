/**
 * 参考:
 * 「ハンズオンWebAssembly」P.299〜
 * コンパイル例:
 * emcc find_primes.c --no-entry -O1 -s ERROR_ON_UNDEFINED_SYMBOLS=0 -o ../../public/webassembly/dlopen/find_primes.wasm
**/

#include <emscripten.h>

extern void logPrime(int prime);

extern int isPrime(int value);

EMSCRIPTEN_KEEPALIVE
void findPrimes(int start, int end)
{
  for (int i = start; i <= end; i += 2) 
  {
    if (isPrime(i)) 
    {
      logPrime(i);
    }
  }
}
