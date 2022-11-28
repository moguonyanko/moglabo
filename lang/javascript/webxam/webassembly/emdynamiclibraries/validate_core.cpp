/**
 * 参考:
 * 「ハンズオンWebAssembly」P.322〜 
 * コンパイル例:
 * emcc validate_core.cpp --js-library mergeinto.js -s MAIN_MODULE=2 -s MODULARIZE=1 -s "EXPORTED_FUNCTIONS=['_strlen', '_atoi']" -s "EXPORTED_RUNTIME_METHODS=['ccall', 'stringToUTF8', 'UTF8ToString']" -o ../../public/webassembly/emdynamiclibraries/validate_core.js
 */

#include <cstdlib>
#include <cstdint>

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

int isIdInArray(char* selected_id, int* valid_ids, 
  int array_length)
{
  int id = atoi(selected_id);
  for (int index = 0; index < array_length; index++) 
  {
    if (valid_ids[index] == id) 
    {
      return 1;
    }
  }

  return 0;
}

#ifdef __cplusplus
}
#endif
