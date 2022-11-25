/**
 * 参考:
 * 「ハンズオンWebAssembly」P.275〜
 * コンパイル例:
 * emcc calculate_primes.cpp -s SIDE_MODULE=2 -O1 -o ../../public/webassembly/dlopen/calculate_primes.wasm
**/

#include <cstdlib>
#include <cstdio>
#include <emscripten.h>

#ifdef __cplusplus
extern "C" {
#endif

int isPrime(int value) 
{
  if (value == 2) return 1;

  if (value <= 1 || value % 2 == 0) return 0;

  for (int i = 3; (i * i) <= value; i += 2) 
  {
    if (value % i == 0) return 0;
  }

  return 1;
}

EMSCRIPTEN_KEEPALIVE
void findPrimes(int start, int end)
{
  printf("素数検出 %d から %d まで", start, end);

  for (int i = start; i <= end; i += 2) 
  {
    if (isPrime(i)) 
    {
      printf("%d,", i);
    }
  }

  printf("\n");
}

int main() 
{
  int start = 3;
  int end = 100000;

  findPrimes(start, end);

  return 0;  
}

#ifdef __cplusplus
}
#endif
