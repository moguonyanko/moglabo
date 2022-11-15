/**
 * 参考:
 * 「ハンズオンWebAssembly」P.126 
 * コンパイル例:
 * emcc validate.cpp -o ../../public/webassembly/js_plumbing/validate.js -s "EXPORTED_RUNTIME_METHODS=['ccall', 'UTF8ToString']" -s "EXPORTED_FUNCTIONS=['_malloc', '_free']"
 **/

#include <cstdlib>
#include <cstring>

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#endif

#ifdef __cplusplus
extern "C" {
#endif

int validateValueProvided(const char* value, const char* error_message, 
  char* return_error_message) 
{
    if ((value == NULL) || (value[0] == '\0')) {
      strcpy(return_error_message, error_message);
      return 0;
    }

    return 1;
}

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
int validateName(char* name, int max_length, char* return_error_message)
{
  if (validateValueProvided(name, "商品名は必須です", return_error_message) == 0) 
  {
    return 0;
  }

  if (strlen(name) > max_length) 
  {
    strcpy(return_error_message, "商品名が長すぎます");
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

int validateCategory(char* category_id, int* valid_category_ids, int array_length, 
  char* return_error_message)
{
  if (validateValueProvided(category_id, "商品名は必須です", return_error_message) == 0) 
  {
    return 0;
  }

  if ((valid_category_ids == NULL) || (array_length == 0)) 
  {
    strcpy(return_error_message, "利用可能な商品カテゴリがありません");
    return 0;
  }

  if (isCategoryIdInArray(category_id, valid_category_ids, array_length) == 0) 
  {
    strcpy(return_error_message, "選択された商品カテゴリIDが正しくありません");
    return 0;
  }

  return 1;
}

#ifdef __cplusplus
}
#endif
