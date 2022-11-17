/**
 * 参考:
 * 「ハンズオンWebAssembly」P.126〜 
 * コンパイル例:
 * ・Cのライブラリ関数を使用しJavaScriptを出力する場合
 * emcc validate.cpp -o ../../public/webassembly/js_plumbing/validate.js -s "EXPORTED_RUNTIME_METHODS=['ccall', 'UTF8ToString']" -s "EXPORTED_FUNCTIONS=['_malloc', '_free']"
 * ・Cのライブラリ関数を使用せずJavaScriptを出力しない場合
 * emcc validate.cpp -O1 --no-entry -o ../../public/webassembly/js_plumbing/validate.wasm
 * ・出力されるJavaScriptに独自の関数をマージしたい場合
 * emcc validate.cpp -O1 --js-library mergeinto.js -s "EXPORTED_RUNTIME_METHODS=['ccall', 'UTF8ToString']" -s "EXPORTED_FUNCTIONS=['_malloc', '_free']" -o ../../public/webassembly/js_plumbing/validate.js
 * ・JavaScriptを出力せずにWebAssemblyモジュールからJavaScriptの関数を呼び出す場合(P.191)
 * emcc validate.cpp -O1 --no-entry -s ERROR_ON_UNDEFINED_SYMBOLS=0 -o ../../public/webassembly/js_plumbing/validate.wasm 
 * 
 */

#include <cstdlib>
#include <cstdint>
#include <cstring>

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#endif

#ifdef __cplusplus
extern "C" {
#endif

extern void UpdateHostAboutError(const char* error_message);

/**
 * 簡易版malloc関数
 */
#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
uint8_t* create_buffer(int size_needed) 
{
  return new uint8_t[size_needed];
}

/**
 * 簡易版free関数 
 */
#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
void free_buffer(const char* pointer) 
{
  delete pointer;
}

int validateValueProvided(const char* value, const char* error_message) 
{
    if ((value == NULL) || (value[0] == '\0')) {
      UpdateHostAboutError(error_message);
      return 0;
    }

    return 1;
}

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
int validateName(char* name, int max_length)
{
  if (validateValueProvided(name, "商品名は必須です。(例：𩸽を𠮟る𠮷野家)") == 0) 
  {
    return 0;
  }

  if (strlen(name) > max_length) 
  {
    UpdateHostAboutError("商品名が長すぎます。");
    return 0;
  }

  return 1;
}

int isCategoryIdInArray(char* selected_category_id, int* valid_category_ids, 
  int array_length)
{
  int category_id = atoi(selected_category_id);
  for (int index = 0; index < array_length; index++) 
  {
    if (valid_category_ids[index] == category_id) 
    {
      return 1;
    }
  }

  return 0;
}

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif

int validateCategory(char* category_id, int* valid_category_ids, int array_length)
{
  if (validateValueProvided(category_id, "商品名は必須です。(例：𩸽を𠮟る𠮷野家)") == 0) 
  {
    return 0;
  }

  if ((valid_category_ids == NULL) || (array_length == 0)) 
  {
    UpdateHostAboutError("利用可能な商品カテゴリがありません。");
    return 0;
  }

  if (isCategoryIdInArray(category_id, valid_category_ids, array_length) == 0) 
  {
    UpdateHostAboutError("選択された商品カテゴリIDが正しくありません。");
    return 0;
  }

  return 1;
}

#ifdef __cplusplus
}
#endif
