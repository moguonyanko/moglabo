/**
 * 参考:
 * 「ハンズオンWebAssembly」P.141〜
 */

const initialData = {
  name: 'ダメージジーンズ',
  categoryId: '100'
};

const MAXIMUM_NAME_LENGTH = 50;
const VALID_CATEGORY_IDS = [100, 101];

let moduleMemory = null;
let moduleExports = null;

const initializePage = async () => {
  const importObject = {
    wasi_snapshot_preview1: {
      proc_exit: value => { }
    },
    env: {
      UpdateHostAboutError: errorMessagePointer => {
        setErrorMessage(getStringFromMemory(errorMessagePointer));
      }
    }
  };

  const result = await WebAssembly.instantiateStreaming(fetch('validate.wasm'),
    importObject);
  moduleExports = result.instance.exports;
  moduleMemory = moduleExports.memory;

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
  const namePointer = moduleExports.create_buffer(name.length + 1);
  copyStringToMemory(name, namePointer);

  const isValid = moduleExports.validateName(namePointer, MAXIMUM_NAME_LENGTH);

  return isValid === 1;
};

const validateCategory = categoryId => {
  const categoryIdPointer = moduleExports.create_buffer(categoryId.length + 1);
  copyStringToMemory(categoryId, categoryIdPointer);

  const arrayLength = VALID_CATEGORY_IDS.length;
  const bytesPerElement = Int32Array.BYTES_PER_ELEMENT;
  const arrayPointer = moduleExports.create_buffer(arrayLength * bytesPerElement);

  const bytesForArray = new Int32Array(moduleMemory.buffer);
  bytesForArray.set(VALID_CATEGORY_IDS, arrayPointer / bytesPerElement);

  const isValid = moduleExports.validateCategory(categoryIdPointer, arrayPointer,
    arrayLength);

  moduleExports.free_buffer(arrayPointer);
  moduleExports.free_buffer(categoryIdPointer);

  return isValid === 1;
};

const listeners = {
  onClickSave: () => {
    setErrorMessage('');

    const name = document.getElementById('name').value;
    const categoryId = getSelectedCategoryId();

    if (validateName(name) && validateCategory(categoryId)) {
      const msg = '登録成功(テスト)';
      console.log(msg, new Date());
      alert(msg);
    }
  }
};

const addListener = () => {
  const main = document.querySelector('main');
  main.addEventListener('click', event => {
    const { eventTarget } = event.target.dataset;

    if (typeof listeners[eventTarget] === 'function') {
      event.stopPropagation();
      listeners[eventTarget]();
    }
  });
};

window.addEventListener('DOMContentLoaded', async () => {
  await initializePage();
  addListener();
});