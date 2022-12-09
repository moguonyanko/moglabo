/**
 * 参考:
 * 「ハンズオンWebAssembly」P.399〜
 * コンパイル例:
 * emcc calculate_primes.cpp -O1 -std=c++11 -s USE_PTHREADS=1 -s PTHREAD_POOL_SIZE=4 -o ../../public/webassembly/pthreads/index.html
 * ・JavaScriptとWebAssemblyモジュールだけを出力する場合
 * emcc calculate_primes.cpp -O1 -std=c++11 -s USE_PTHREADS=1 -s PTHREAD_POOL_SIZE=4 -o ../../public/webassembly/pthreads/pthreads.js
 */

#include <cstdlib>
#include <cstdio>
#include <vector>
#include <chrono>
#include <pthread.h>
#include <emscripten.h>

#ifdef __cplusplus
extern "C" {
#endif

struct thread_args 
{
  int start;
  int end;
  std::vector<int> primes_found;
};

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
  if (start % 2 == 0) {
    start += 1;
  }

  for (int i = start; i <= end; i += 2) 
  {
    if (isPrime(i)) 
    {
      primes_found.push_back(i);
    }
  }
}

void* thread_func(void* arg)
{
  struct thread_args* args = (struct thread_args*)arg;

  findPrimes(args->start, args->end, args->primes_found);

  return arg; 
}

int main() 
{
  int start = 3;
  int end = 1000000;
  printf("素数検出 %d から %d まで", start, end);

  std::chrono::high_resolution_clock::time_point duration_start = 
    std::chrono::high_resolution_clock::now();

  int thread_size = 4;
  pthread_t thread_ids[thread_size];
  struct thread_args args[5];
  int args_index = 1;
  int args_start = 200000;

  for (int i = 0; i < thread_size; i++) 
  {
    args[args_index].start = args_start;
    args[args_index].end = args_start + 199999;

    if (pthread_create(&thread_ids[i],
      NULL,
      thread_func,
      &args[args_index]
    ))
    { 
      perror("スレッド作成失敗");
      return 1;
    }

    args_index += 1;
    args_start += 200000;
  }  

  findPrimes(start, 199999, args[0].primes_found);

  for (int i = 0; i < 4; i++) 
  {
    pthread_join(thread_ids[i], NULL);
  }

  std::chrono::high_resolution_clock::time_point duration_end = 
    std::chrono::high_resolution_clock::now();

  std::chrono::duration<double, std::milli> duration = duration_end - duration_start;

  printf("素数検出に %f ミリ秒かかりました。\n", duration.count());

  printf("\n");
  for (int k = 0; k < 5; k++) 
  {
    for (int prime : args[k].primes_found) 
    {
      printf("%d ", prime);
    }
  }
  printf("\n");

  return 0;  
}

#ifdef __cplusplus
}
#endif
