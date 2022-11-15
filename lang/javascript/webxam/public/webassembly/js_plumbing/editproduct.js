/**
 * 参考:
 * 「ハンズオンWebAssembly」P.141
 */

const Module = window.Module;

const initialData = {
  name: 'ダメージジーンズ',
  categoryId: '100'
};

const MAXIMUM_NAME_LENGTH = 50;
const VALID_CATEGORY_IDS = [100, 101];

const initializePage = () => {
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
  const functionName = 'validateName'
  const returnType = 'number';
  const paramTypes = ['string', 'number', 'number'];
  const paramValues = [name, MAXIMUM_NAME_LENGTH, errorMessagePointer];

  const isValid = Module.ccall(functionName, returnType, paramTypes, paramValues);

  return isValid === 1;
};

const validateCategory = (categoryId, errorMessagePointer) => {
  const arrayLength = VALID_CATEGORY_IDS.length;
  const bytesPerElement = Module.HEAP32.BYTES_PER_ELEMENT;
  const arrayPointer = Module._malloc(arrayLength * bytesPerElement);
  Module.HEAP32.set(VALID_CATEGORY_IDS, arrayPointer / bytesPerElement);

  const functionName = 'validateCategory';
  const returnType = 'number';
  const paramTypes = ['string', 'number', 'number', 'number'];
  const paramValues = [categoryId, arrayPointer, arrayLength, errorMessagePointer];
  const isValid = Module.ccall(functionName, returnType, paramTypes, paramValues);

  Module._free(arrayPointer);

  return isValid === 1;
};

const listeners = {
  onClickSave: () => {
    let errorMessage = '';
    const errorMessagePointer = Module._malloc(256);

    const name = document.getElementById('name').value;
    const categoryId = getSelectedCategoryId();

    if (!validateName(name, errorMessagePointer) || 
    !validateCategory(categoryId, errorMessagePointer)) {
      errorMessage = Module.UTF8ToString(errorMessagePointer);
    }

    Module._free(errorMessagePointer);

    setErrorMessage(errorMessage);

    if (!errorMessage) {
      console.log(`登録成功:${new Date()}`);
      // TODO: 成功時の処理
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

window.addEventListener('DOMContentLoaded', () => {
  initializePage();
  addListener();
});
