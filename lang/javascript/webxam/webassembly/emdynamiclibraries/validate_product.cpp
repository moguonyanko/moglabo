/**
 * 参考:
 * 「ハンズオンWebAssembly」P.322〜 
 * コンパイル例:
 * emcc validate_product.cpp -s SIDE_MODULE=2 -O1 -o ../../public/webassembly/emdynamiclibraries/validate_product.wasm
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

extern int validateValueProvided(const char* value, const char* error_message);
extern int isIdInArray(char* selected_id, int* valid_ids, int array_length);
extern void UpdateHostAboutError(const char* error_message);

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

  if (isIdInArray(category_id, valid_category_ids, array_length) == 0) 
  {
    UpdateHostAboutError("選択された商品カテゴリIDが正しくありません。");
    return 0;
  }

  return 1;
}

#ifdef __cplusplus
}
#endif
