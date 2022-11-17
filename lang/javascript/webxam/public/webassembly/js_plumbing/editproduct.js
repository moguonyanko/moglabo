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
  const isValid = Module.ccall('validateName', 'number', ['string', 'number'],
    [name, MAXIMUM_NAME_LENGTH]);

  return isValid === 1;
};

const validateCategory = categoryId => {
  const arrayLength = VALID_CATEGORY_IDS.length;
  const bytesPerElement = Module.HEAP32.BYTES_PER_ELEMENT;
  const arrayPointer = Module._malloc(arrayLength * bytesPerElement);
  Module.HEAP32.set(VALID_CATEGORY_IDS, arrayPointer / bytesPerElement);

  const isValid = Module.ccall('validateCategory', 'number', 
    ['string', 'number', 'number'], [categoryId, arrayPointer, arrayLength]);

  Module._free(arrayPointer);

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
