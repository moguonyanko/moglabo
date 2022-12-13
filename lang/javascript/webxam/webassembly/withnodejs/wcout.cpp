/**
 * マルチバイト文字の扱いを調べるサンプル
 * コンパイル例:
 * emcc wcout.cpp -O1 -s "EXPORTED_FUNCTIONS=['_printMultibyteChars']" -o wcout.wasm
 * ・WerbAssemblyモジュールではなくCプログラムとしてコンパイルする場合
 * g++ -o wcout wcout.cpp
 */

#include <stdio.h>
#include <iostream>
#include <string>
#include <locale.h>

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#endif

#ifdef __cplusplus
extern "C" {
#endif

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
void printMultibyteChars()
{
  //setlocale(LC_ALL, "Japanese"); // NG
  //std::wcout.imbue(std::locale("")); // OK
  std::locale loc("");
  //std::cout.imbue(loc); // なくてもOK
  std::wcout.imbue(loc); // ないとNG

  std::wstring str = L"1.亜伊宇江尾\n";
  //std::wcout.write(L"1.亜伊宇江尾\n",24);
  std::wcout << str << std::endl;
  std::cout << "2.亜伊宇江尾\n";
  std::wcout << L"3.亜伊宇江尾\n";
  printf("%s", "4.亜伊宇江尾\n");

  printf("%s", "5.𩸽を叱る𠮷野家\n");
}

int main()
{
  printMultibyteChars();

  return 0;
}

#ifdef __cplusplus
}
#endif
