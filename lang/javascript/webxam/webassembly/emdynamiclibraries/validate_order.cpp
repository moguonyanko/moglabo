/**
 * 参考:
 * 「ハンズオンWebAssembly」P.327〜 
 * コンパイル例:
 * emcc validate_order.cpp -s SIDE_MODULE=2 -O1 -o ../../public/webassembly/emdynamiclibraries/validate_order.wasm  
 */

#include <cstdlib>

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
int validateProduct(char* product_id, int* validate_product_ids, int array_length)
{
  if (validateValueProvided(product_id, "製品IDは必須です。") == 0) 
  {
    return 0;
  }

  if (validate_product_ids == NULL || array_length == 0)
  {
    UpdateHostAboutError("利用できる製品IDが存在しません。");
    return 0;
  }

  if (isIdInArray(product_id, validate_product_ids, array_length) == 0) 
  {
    UpdateHostAboutError("製品IDが正しくありません。");
    return 0;
  }

  return 1;
}

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
int validateQuantity(char* quantity)
{
  if (validateValueProvided(quantity, "数量は必須です。") == 0)
  {
    return 0;
  }

  if (atol(quantity) < 1 || 1000 < atol(quantity))
  {
    UpdateHostAboutError("数量は1以上1000以下を指定して下さい。");
    return 0;
  }

  return 1;
}

#ifdef __cplusplus
}
#endif

