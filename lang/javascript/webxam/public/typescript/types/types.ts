/**
 * @fileoverview 型調査用スクリプト
 * https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types
 */

const getLength = (value: any[] | string): number => {
  return value.length;  
};

const initFuncs = {
  uniontypes: (): void => {
    const output = document.querySelector('.example.uniontypes .output');
    output.textContent += `「Hello」の長さは${getLength('Hello')},`;
    output.textContent += `[1,2,3,4,5]のサイズは${getLength([1,2,3,4,5])}`;
  }
};

// entry point
Object.values(initFuncs).forEach(f => f());
