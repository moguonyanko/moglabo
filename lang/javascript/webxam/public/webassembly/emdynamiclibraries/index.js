/**
 * 参考:
 * 「ハンズオンWebAssembly」P.348〜
 */

const initialProductData = {
  name: 'ダメージジーンズ',
  categoryId: '100'
};

const MAXIMUM_NAME_LENGTH = 50;
const VALID_CATEGORY_IDS = [100, 101];
const VALID_PRODUCT_IDS = [200, 301];

// 各サイドモジュールが提供するModuleオブジェクトを保持する変数
let productModule = null;
let orderModule = null;

const setActiveNavLink = editProduct => {
  const [ navEditProduct, navPlaceOrder ] = [
    document.getElementById('navEditProduct'), 
    document.getElementById('navPlaceOrder')
  ];
  navEditProduct.classList.remove('active');
  navPlaceOrder.classList.remove('active');

  if (editProduct) {
    navEditProduct.classList.add('active');
  } else {
    navPlaceOrder.classList.add('active');
  }
};

const setFormTitle = editProduct => {
  const titleEle = document.getElementById('formTitle');
  titleEle.textContent = editProduct ? '商品選択' : '注文';
};

const showElement = (elementId, visible) => {
  const element = document.getElementById(elementId);
  element.classList.remove('visible');
  element.classList.remove('invisible');
  element.classList.add(visible ? 'visible' : 'invisible');
};

const switchForm = async (showEditProduct = '') => {
  if (showEditProduct === 'false') {
    showEditProduct = false;
  } else {
    showEditProduct = Boolean(showEditProduct);
  }
  setErrorMessage('');
  setActiveNavLink(showEditProduct);
  setFormTitle(showEditProduct)

  if (showEditProduct) {
    if (!productModule) {
      productModule = await Module({
        dynamicLibraries: ['validate_product.wasm']
      });
    }
    showElement('productForm', true);
    showElement('orderForm', false);
  } else {
    if (!orderModule) {
      orderModule = await Module({
        dynamicLibraries: ['validate_order.wasm']
      });
    }
    showElement('productForm', false);
    showElement('orderForm', true);
  }
};

const initializePage = async () => {
  document.getElementById('name').value = initialProductData.name;

  const category = document.getElementById('category');
  const count = category.length;

  for (let index = 0; index < count; index++) {
    if (category[index].value === initialProductData.categoryId) {
      category.selectedIndex = index;
      break;
    }
  }

  let showEditProduct = true;
  if (window.location.hash?.toLowerCase() === '#placeorder') {
    showEditProduct = false;
  }
  await switchForm(showEditProduct);
};

const getSelectedDropdownId = elementId => {
  const dropdown = document.getElementById(elementId);
  const index = dropdown.selectedIndex;
  let dropdownId = '0';
  if (index !== -1) {
    dropdownId = dropdown[index].value;
  }
  return dropdownId;
};

// Emscriptenから出力されたJSから参照される。
const setErrorMessage = errMessage => {
  const errorMessage = document.getElementById('errorMessage');
  errorMessage.textContent = errMessage;
  showElement('errorMessage', Boolean(errMessage));
};
// wasmへのコンパイル時に出力されるJavaScriptに取り込まれるJavaScriptから参照されるため
// setErrorMessageをグローバルオブジェクトに公開する。
window.setErrorMessage = setErrorMessage;

const validateName = name => {
  const isValid = productModule.ccall('validateName', 'number', ['string', 'number'],
    [name, MAXIMUM_NAME_LENGTH]);

  return isValid === 1;
};

const validateCategory = categoryId => {
  const arrayLength = VALID_CATEGORY_IDS.length;
  const bytesPerElement = productModule.HEAP32.BYTES_PER_ELEMENT;
  const arrayPointer = productModule._malloc(arrayLength * bytesPerElement);
  productModule.HEAP32.set(VALID_CATEGORY_IDS, arrayPointer / bytesPerElement);

  const isValid = productModule.ccall('validateCategory', 'number', 
    ['string', 'number', 'number'], [categoryId, arrayPointer, arrayLength]);

    productModule._free(arrayPointer);

  return isValid === 1;
};

const validateProduct = productId => {
  const arrayLength = VALID_PRODUCT_IDS.length;
  // validate_order.cppで定義された関数を呼び出すのでorderModuleを使う。
  const bytesPerElement = orderModule.HEAP32.BYTES_PER_ELEMENT;
  const arrayPointer = orderModule._malloc(arrayLength * bytesPerElement);
  orderModule.HEAP32.set(VALID_PRODUCT_IDS, arrayPointer / bytesPerElement);

  const isValid = orderModule.ccall('validateProduct',  'number', 
    [ 'string', 'number', 'number' ], [ productId, arrayPointer, arrayLength ]);

  orderModule._free(arrayPointer);
  
  return isValid === 1;
};

const validateQuantity = quantity => {
  const isValid = orderModule.ccall('validateQuantity', 'numbdr', 
    [ 'string' ], [ quantity ]);

  return isValid === 1;
};

const success = () => {
  const msg = '登録成功(テスト)';
  console.log(msg, new Date());
  alert(msg);
};

const listeners = {
  onClickSaveProduct: () => {
    setErrorMessage('');

    const name = document.getElementById('name').value;
    const categoryId = getSelectedDropdownId('category');

    if (validateName(name) && validateCategory(categoryId)) {
      success();
    }
  },
  switchForm,
  onClickAddToCart: () => {
    setErrorMessage('');

    const productId = getSelectedDropdownId('product');
    const quantity = document.getElementById('quantity').value;

    if (validateProduct(productId) && validateQuantity(quantity)) {
      success();
    }
  }
};

const addListener = () => {
  const body = document.querySelector('body');
  body.addEventListener('click', event => {
    const { eventTarget, eventArgs } = event.target.dataset;

    if (typeof listeners[eventTarget] === 'function') {
      event.stopPropagation();
      listeners[eventTarget](eventArgs);
    }
  });
};

window.addEventListener('DOMContentLoaded', async () => {
  await initializePage();
  addListener();
});