/**
 * @fileoverview 型調査用スクリプト
 * https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types
 */

const getLength = (value: any[] | string): number => {
  return value.length;  
};

type Member = {
  name: string;
  age: number;
}

const getMemberInfo = (member: Member): string => {
  return `My name is ${member.name}, I am ${member.age} years old.`;
};

interface Car {
  speed: number;
}

const getCarSpeed = (car: Car, boost: 2 | 3 | 4): number => {
  return car.speed * boost;
};

const initFuncs = {
  uniontypes: (): void => {
    const message: string = 'Hello' as 'Hello';
    const output: HTMLElement = document.querySelector('.example.uniontypes .output');
    output.textContent += `「${message}」の長さは${getLength(message)},`;
    output.textContent += `[1,2,3,4,5]のサイズは${getLength([1,2,3,4,5])}`;
  },
  typealiases: (): void => {
    const output: HTMLElement = document.querySelector('.example.typealiases .output');
    output.textContent += getMemberInfo({ name: 'Masao', age: 29 });
  },
  interfaces: (): void => {
    const output: HTMLElement = document.querySelector('.example.interfaces .output');
    output.textContent += getCarSpeed({ speed: 100 }, 3);
  }
};

// entry point
Object.values(initFuncs).forEach(f => f());
