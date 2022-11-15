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
      proc_exit: value => {}
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

/**
 * @todo メッセージがマルチバイト文字を含む場合文字化けしてしまう。
 */
const getStringFromMemory = memoryOffset => {
  let returnValue = '';

  const size = 256;
  const bytes = new Uint8Array(moduleMemory.buffer, memoryOffset, size);

  let character = '';
  for (let index = 0; index < size; index++) {
    character = String.fromCharCode(bytes[index]);
    if (character === '\0') {
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

const validateName = (name, errorMessagePointer) => {
  const namePointer = moduleExports.create_buffer(name.length + 1);
  copyStringToMemory(name, namePointer);

  const isValid = moduleExports.validateName(namePointer, MAXIMUM_NAME_LENGTH, errorMessagePointer);

  return isValid === 1;
};

const validateCategory = (categoryId, errorMessagePointer) => {
  const categoryIdPointer = moduleExports.create_buffer(categoryId.length + 1);
  copyStringToMemory(categoryId, categoryIdPointer);  

  const arrayLength = VALID_CATEGORY_IDS.length;
  const bytesPerElement = Int32Array.BYTES_PER_ELEMENT;
  const arrayPointer = moduleExports.create_buffer(arrayLength * bytesPerElement);

  const bytesForArray = new Int32Array(moduleMemory.buffer);
  bytesForArray.set(VALID_CATEGORY_IDS, arrayPointer / bytesPerElement);

  const isValid = moduleExports.validateCategory(categoryIdPointer, arrayPointer, 
    arrayLength, errorMessagePointer);

    moduleExports.free_buffer(arrayPointer);
    moduleExports.free_buffer(categoryIdPointer);

  return isValid === 1;
};

const listeners = {
  onClickSave: () => {
    let errorMessage = '';
    const errorMessagePointer = moduleExports.create_buffer(256);

    const name = document.getElementById('name').value;
    const categoryId = getSelectedCategoryId();

    if (!validateName(name, errorMessagePointer) || 
    !validateCategory(categoryId, errorMessagePointer)) {
      errorMessage = getStringFromMemory(errorMessagePointer);
    }

    moduleExports.free_buffer(errorMessagePointer);

    setErrorMessage(errorMessage);

    if (!errorMessage) {
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
