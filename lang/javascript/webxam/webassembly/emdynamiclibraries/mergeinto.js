/**
 * 参考:
 * 「ハンズオンWebAssembly」P.340
 * Emscriptenが生成するJavaScriptに組み込まれる。
 */

mergeInto(LibraryManager.library, {
  // function式で宣言しないとEmscriptenが生成するJavaScriptにマージされない。
  UpdateHostAboutError: function(errorMessagePointer) {
    setErrorMessage(Module.UTF8ToString(errorMessagePointer));
  }
});
