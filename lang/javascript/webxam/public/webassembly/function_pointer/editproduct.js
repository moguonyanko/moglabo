/**
 * 参考:
 * 「ハンズオンWebAssembly」P.223〜
 */

const Module = window.Module;

const initialData = {
  name: 'ダメージジーンズ',
  categoryId: '100'
};

const MAXIMUM_NAME_LENGTH = 50;
const VALID_CATEGORY_IDS = [100, 101];

const initializePage = async () => {
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

const freePointers = (onSuccess, onError) => {
  Module.removeFunction(onSuccess);
  Module.removeFunction(onError);
};

const createPointers = (resolve, reject, returnPointers) => {
  const onSuccess = Module.addFunction(() => {
    freePointers(onSuccess, onError);
    resolve();
  }, 'v');

  const onError = Module.addFunction(errorMessage => {
    freePointers(onSuccess, onError);
    reject(Module.UTF8ToString(errorMessage));
  }, 'vi');

  returnPointers.onSuccess = onSuccess;
  returnPointers.onError = onError;
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

// Emscriptenから出力されたJSから参照される。
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
    const pointers = { onSuccess: null, onError: null };
    createPointers(resolve, reject, pointers);

    Module.ccall('validateName',
      null,
      ['string', 'number', 'number', 'number'],
      [name, MAXIMUM_NAME_LENGTH, pointers.onSuccess, pointers.onError]
    );
  });
};

const validateCategory = categoryId => {
  return new Promise((resolve, reject) => {
    const pointers = { onSuccess: null, onError: null };
    createPointers(resolve, reject, pointers);

    const arrayLength = VALID_CATEGORY_IDS.length;
    const bytesPerElement = Module.HEAP32.BYTES_PER_ELEMENT;
    const arrayPointer = Module._malloc(arrayLength * bytesPerElement);
    Module.HEAP32.set(VALID_CATEGORY_IDS, arrayPointer / bytesPerElement);

    Module.ccall('validateCategory',
      null,
      ['string', 'number', 'number', 'number', 'number'],
      [categoryId, arrayPointer, arrayLength, pointers.onSuccess, pointers.onError]
    );

    Module._free(arrayPointer);
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
