/**
 * 参考:
 * 「ハンズオンWebAssembly」P.241〜
 */

const initialData = {
  name: 'ダメージジーンズ',
  categoryId: '100'
};

const MAXIMUM_NAME_LENGTH = 50;
const VALID_CATEGORY_IDS = [100, 101];

let moduleMemory = null;
let moduleExports = null;
let validateOnSuccessNameIndex = -1;
let validateOnSuccessCategoryIndex = -1;
let validateOnErrorNameIndex = -1;
let validateOnErrorCategoryIndex = -1;

const validateNameCallbacks = {
  resolve: null,
  reject: null
};
const validateCategoryCallbacks = {
  resolve: null,
  reject: null
};

let moduleTable = null;

const FUNC_NAME = {
  validateName: 'validateName',
  validCategory: 'validCategory'
};

const createPointers = (funcName, resolve, reject) => {
  const returnPointers = {};
  switch (funcName) {
    case FUNC_NAME.validateName:
      validateNameCallbacks.resolve = resolve;
      validateNameCallbacks.reject = reject;
      returnPointers.onSuccess = validateOnSuccessNameIndex;
      returnPointers.onError = validateOnErrorNameIndex;
      break;
    case FUNC_NAME.validCategory:
      validateCategoryCallbacks.resolve = resolve;
      validateCategoryCallbacks.reject = reject;
      returnPointers.onSuccess = validateOnSuccessCategoryIndex;
      returnPointers.onError = validateOnErrorCategoryIndex;
      break;
    default:
      throw new Error(`Invalid function name:${funcName}`);
  }
  return returnPointers;
};

const onSuccessCallback = validateCallbacks => {
  validateCallbacks.resolve();
  validateCallbacks.resolve = null;
  validateCallbacks.reject = null;
};

const onErrorCallback = (validateCallbacks, errorMessagePointer) => {
  const errorMessage = getStringFromMemory(errorMessagePointer);
  validateCallbacks.reject(errorMessage);
  validateCallbacks.resolve = null;
  validateCallbacks.reject = null;
};

// validate.jsから抜粋(一部改変)
function sigToWasmTypes(sig) {
  const typeNames = {
    'i': 'i32',
    // i64 values will be split into two i32s.
    'j': 'i32',
    'f': 'f32',
    'd': 'f64',
    'p': 'i32',
  };
  const type = {
    parameters: [],
    results: sig[0] == 'v' ? [] : [typeNames[sig[0]]]
  };
  for (let i = 1; i < sig.length; ++i) {
    if (!(sig[i] in typeNames)) {
      throw new Error('invalid signature char: ' + sig[i]);
    }
    type.parameters.push(typeNames[sig[i]]);
    if (sig[i] === 'j') {
      type.parameters.push('i32');
    }
  }
  return type;
}

function convertJsFunctionToWasm(func, sig) {
  if (typeof WebAssembly.Function == "function") {
    return new WebAssembly.Function(sigToWasmTypes(sig), func);
  } else {
    throw new Error('WebAssembly.Functionが未実装です。');
  }
}
// validate.jsからの抜粋終了

const addToTable = (jsFunction, signature) => {
  const index = moduleTable.length;

  moduleTable.grow(1);

  moduleTable.set(index, convertJsFunctionToWasm(jsFunction, signature));

  return index;
};

const initializePage = async () => {
  const importObject = {
    wasi_snapshot_preview1: {
      proc_exit: value => { }
    }
  };

  const result = await WebAssembly.instantiateStreaming(fetch('validate_nojs.wasm'),
    importObject);
  moduleExports = result.instance.exports;
  moduleMemory = moduleExports.memory;
  moduleTable = moduleExports.__indirect_function_table;

  validateOnSuccessNameIndex = addToTable(() => {
    onSuccessCallback(validateNameCallbacks);
  }, 'v');

  validateOnSuccessCategoryIndex = addToTable(() => {
    onSuccessCallback(validateCategoryCallbacks);
  }, 'v');

  validateOnErrorNameIndex = addToTable(errorMessagePointer => {
    onErrorCallback(validateNameCallbacks, errorMessagePointer);
  }, 'vi');

  validateOnErrorCategoryIndex = addToTable(errorMessagePointer => {
    onErrorCallback(validateCategoryCallbacks, errorMessagePointer);
  }, 'vi');

  document.getElementById('name').value = initialData.name;

  const category = document.getElementById('category');
  const count = category.length;

  for (let index = 0; index < count; index++) {
    if (category[index].value === initialData.categoryId) {
      category.selectedIndex = index;
      break;
    }
  }
};

const getStringFromMemory = memoryOffset => {
  let returnValue = '';

  const size = 256;
  let bytes = new Uint8Array(moduleMemory.buffer, memoryOffset, size);
  bytes = new TextDecoder('UTF-8').decode(bytes);

  // 目的のメッセージの後に大量のNULL文字(\u0000、\0と同じ)が付与されているので除去する。

  // replaceだと余計な文字がNULL文字の間に混ざった場合に置換しそこなって残ってしまう。
  //returnValue = bytes.replace(/\0/g, '');

  let character = '';
  for (let index = 0; index < size; index++) {
    character = bytes[index];
    if (character === '\0') { // \u0000と\0は等しくなる。
      break;
    }
    returnValue += character;
  }

  return returnValue;
};

const copyStringToMemory = (value, memoryOffset) => {
  const bytes = new Uint8Array(moduleMemory.buffer);
  bytes.set(new TextEncoder().encode(value + '\0'), memoryOffset);
};

const getSelectedCategoryId = () => {
  const category = document.getElementById('category');
  const index = category.selectedIndex;
  let categoryId = '0';
  if (index !== -1) {
    categoryId = category[index].value;
  }
  return categoryId;
};

const setErrorMessage = errMessage => {
  const errorMessage = document.getElementById('errorMessage');
  errorMessage.textContent = errMessage;
  if (errMessage) {
    errorMessage.classList.add('error');
  } else {
    errorMessage.classList.remove('error');
  }
};

const validateName = name => {
  return new Promise((resolve, reject) => {
    const pointers = createPointers(FUNC_NAME.validateName, resolve, reject);

    const namePointer = moduleExports.create_buffer(name.length + 1);
    copyStringToMemory(name, namePointer);

    moduleExports.validateName(namePointer, MAXIMUM_NAME_LENGTH,
      pointers.onSuccess, pointers.onError);

    moduleExports.free_buffer(namePointer);
  });
};

const validateCategory = categoryId => {
  return new Promise((resolve, reject) => {
    const pointers = createPointers(FUNC_NAME.validCategory, resolve, reject);

    const categoryIdPointer = moduleExports.create_buffer(categoryId.length + 1);
    copyStringToMemory(categoryId, categoryIdPointer);

    const arrayLength = VALID_CATEGORY_IDS.length;
    const bytesPerElement = Int32Array.BYTES_PER_ELEMENT;
    const arrayPointer = moduleExports.create_buffer(arrayLength * bytesPerElement);

    const bytesForArray = new Int32Array(moduleMemory.buffer);
    bytesForArray.set(VALID_CATEGORY_IDS, arrayPointer / bytesPerElement);

    moduleExports.validateCategory(categoryIdPointer, arrayPointer,
      arrayLength, pointers.onSuccess, pointers.onError);

    moduleExports.free_buffer(arrayPointer);
    moduleExports.free_buffer(categoryIdPointer);
  });
};

const listeners = {
  onClickSave: async () => {
    setErrorMessage('');

    const name = document.getElementById('name').value;
    const categoryId = getSelectedCategoryId();

    try {
      await Promise.all([validateName(name), validateCategory(categoryId)]);
      const msg = '登録成功(テスト)';
      console.log(msg, new Date());
      alert(msg);
    } catch (err) {
      setErrorMessage(err);
    }
  }
};

const addListener = () => {
  const main = document.querySelector('main');
  main.addEventListener('click', async event => {
    const { eventTarget } = event.target.dataset;

    if (typeof listeners[eventTarget] === 'function') {
      event.stopPropagation();
      await listeners[eventTarget]();
    }
  });
};

window.addEventListener('DOMContentLoaded', async () => {
  await initializePage();
  addListener();
});