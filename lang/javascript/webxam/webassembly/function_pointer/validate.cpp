/**
 * 参考:
 * 「ハンズオンWebAssembly」P.211〜 
 * コンパイル例:
 * emcc validate.cpp -s RESERVED_FUNCTION_POINTERS=4 -s "EXPORTED_RUNTIME_METHODS=['ccall', 'UTF8ToString', 'addFunction', 'removeFunction']" -s "EXPORTED_FUNCTIONS=['_malloc', '_free']" -o ../../public/webassembly/function_pointer/validate.js
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

typedef void(*OnSuccess)(void); 
typedef void(*OnError)(const char*); 

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

int validateValueProvided(const char* value) 
{
    if ((value == NULL) || (value[0] == '\0')) {
      return 0;
    }

    return 1;
}

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
void validateName(char* name, int max_length, OnSuccess UpdateHostOnSuccess, 
  OnError UpdateHostOnError)
{
  if (validateValueProvided(name) == 0) 
  {
    UpdateHostOnError("商品名は必須です。(例：𩸽を𠮟る𠮷野家)");
  } else if (strlen(name) > max_length) {
    UpdateHostOnError("商品名が長すぎます。");
  } else {
    UpdateHostOnSuccess();
  }
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

void validateCategory(char* category_id, int* valid_category_ids, int array_length, 
  OnSuccess UpdateHostOnSuccess, OnError UpdateHostOnError)
{
  if (validateValueProvided(category_id) == 0) 
  {
    UpdateHostOnError("商品カテゴリは必須です。");
  } else if ((valid_category_ids == NULL) || (array_length == 0)) {
    UpdateHostOnError("利用できる商品カテゴリがありません。");
  } else if (isCategoryIdInArray(category_id, valid_category_ids, array_length) == 0) {
    UpdateHostOnError("商品カテゴリが不適切です。");
  } else {
    UpdateHostOnSuccess();
  }
}

#ifdef __cplusplus
}
#endif
