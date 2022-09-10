/**
 * @fileoverview 型調査用スクリプト
 * https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types
 */

const getLength = (value: any[] | string): number => {
  let checkedValue = value.length > 0 ? true : 'empty';
  console.log(checkedValue)
  // checkedValueはbooleanかstringで型が推測されているので他の型の値を割り当てようとすると
  // コンパイルエラーになる。
  //checkedValue = 1; 
  return value.length;  
};

type Member = {
  name: string;
  age: number;
  talk?: () => string; // ?が付いたプロパティはオブジェクトに定義されていなくてもコンパイルエラーにならない。
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

const dumpMemberInfo = (member?: Member | null): void => {
  // !を変数やプロパティの後ろに付けることでnullではないことを強制できるが実行時例外は防げない。
  try {
    console.log(`${member!.name}:${member!.age}`);
    console.log(member!.talk!());
  } catch (e: any) {
    console.warn(e);
  }
};

interface Cat {
  running: () => string;
  kind: 'cat';
}

interface Bird {
  flying: () => string;
  kind: 'bird';
}

type Animal = Cat | Bird;

const moveAnimal = (animal: Animal): string => {
  switch (animal.kind) {
    case 'cat':
      return animal.running();
    case 'bird':
      return animal.flying();
    default: 
      // type宣言に含まれる型にnever型を割り当てることはできない。
      const _exhaustiveCheck: never = animal;
      return _exhaustiveCheck;
  }
};

const initFuncs = {
  uniontypes: (): void => {
    const message: string = 'Hello' as 'Hello';
    const output: HTMLElement = document.querySelector('.example.uniontypes .output') as HTMLElement;
    output.textContent += `「${message}」の長さは${getLength(message)},`;
    output.textContent += `[1,2,3,4,5]のサイズは${getLength([1,2,3,4,5])}`;
  },
  typealiases: (): void => {
    const output: HTMLElement = document.querySelector('.example.typealiases .output') as HTMLElement;
    const member: Member = { name: 'Masao', age: 29, talk: () => 'How are you?' };
    dumpMemberInfo(member);
    output.textContent += getMemberInfo(member);
  },
  interfaces: (): void => {
    const output: HTMLElement = document.querySelector('.example.interfaces .output') as HTMLElement;
    output.textContent! += getCarSpeed({ speed: 100 }, 3);
  },
  discriminated: () => {
    const output: HTMLElement = document.querySelector('.example.discriminated .output') as HTMLElement;
    const cat: Animal = { running: () => 'NyaNya', kind: 'cat' };
    const bird: Animal  = { flying: () => 'FuwaFuwa', kind: 'bird' };
    const dog  = { kind: 'HogeHoge' };
    output.textContent += moveAnimal(cat);
    output.textContent += moveAnimal(bird);
    output.textContent += moveAnimal(dog as Animal); // asを使って無理矢理Animal型にして渡している。
  }
};

// entry point
Object.values(initFuncs).forEach(f => f());
