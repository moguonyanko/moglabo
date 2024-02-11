/**
 * 参考:
 * 「ハンズオンWebAssembly」P.381〜
 * コンパイル例:
 * emcc calculate_primes.cpp -O1 -std=c++11 -s MODULARIZE=1 -o ../../public/webassembly/prefetch/calculate_primes.js
 * DWARFでデバッグする場合
 * emcc calculate_primes.cpp -g -O1 -std=c++11 -s MODULARIZE=1 -o ../../public/webassembly/prefetch/calculate_primes.js
**/

#include <cstdlib>
#include <cstdio>
#include <vector>
#include <chrono>
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

void findPrimes(int start, int end, std::vector<int>& primes_found)
{
  for (int i = start; i <= end; i += 2) 
  {
    if (isPrime(i)) 
    {
      primes_found.push_back(i);
    }
  }
}

int main() 
{
  int start = 3;
  int end = 1000000;
  printf("素数検出 %d から %d まで", start, end);

  std::chrono::high_resolution_clock::time_point duration_start = 
    std::chrono::high_resolution_clock::now();

  std::vector<int> primes_found;
  findPrimes(start, end, primes_found);

  std::chrono::high_resolution_clock::time_point duration_end = 
    std::chrono::high_resolution_clock::now();

  std::chrono::duration<double, std::milli> duration = duration_end - duration_start;

  printf("素数検出に %f ミリ秒かかりました。\n", duration.count());

  printf("\n");
  for (int prime : primes_found) 
  {
    printf("%d ", prime);
  }
  printf("\n");

  return 0;  
}

#ifdef __cplusplus
}
#endif
