/**
 * 参考:
 * 「ハンズオンWebAssembly」P.73
 * コンパイル例:
 * emcc calculate_primes.c -o ../../public/webassembly/calculate_primes/calculate_primes.js
**/

#include <stdlib.h>
#include <stdio.h>
#include <emscripten.h>

// ES_JS関数で囲むとコンパイルエラーになる。
EM_JS(void, printMessageByMacro, (), {
  console.log('EM_JSシリーズのマクロから文字列出力します。');
});

EM_JS(void, printStartAndEndByMacro, (int start, int end), {
  // バッククォートを使うとコンパイルエラーになる。
  console.log(start + 'から' + end + 'の間の素数を検出します。');
});

int isPrime(int value) {
  if (value == 2) return 1;

  if (value <= 1 || value % 2 == 0) return 0;

  for (int i = 3; (i * i) <= value; i += 2) {
    if (value % i == 0) return 0;
  }

  return 1;
}

int main() {
  int start = 3;
  int end = 199999;

  printMessageByMacro();
  printStartAndEndByMacro(start, end);
  EM_ASM_({
    console.log('EM_ASM_:start=' + $0 + ',end=' + $1);
  }, start, end);

  printf("素数検出 %d から %d まで", start, end);

  for (int i = start; i <= end; i += 2) {
    if (isPrime(i)) {
      printf("%d,", i);
    }
  }
  printf("\n");

  return 0;  
}
