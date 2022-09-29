/**
 * @fileoverview 関数調査用スクリプト
 */

type Greeting = { 
  (greet: string): string 
};

const countAll = <Type extends { length: number }>(target: Type[]): number => {
  return target.map((t: Type) => t.length).reduce((a: number, b: number) => a + b, 0);
};

const sampleEcho = (message: string, onecho: (message: string, echodate?: Date) => void) => {
  console.log(message);
  onecho(message, new Date());
};

interface Student {
  name: string;
}

interface Teacher {
  students: Student[],
  // TODO: sをthisと書けるがそうする利点が公式ドキュメントから読み取れなかった。
  // https://www.typescriptlang.org/docs/handbook/2/functions.html#declaring-this-in-a-function
  collectStudents(filter: (s: Student) => boolean): Student[]
}

const funcs = {
  callsignatures: (): void => {
    const output: HTMLElement = document.querySelector('.example.callsignatures .output') as HTMLElement;
    const greeting: Greeting = (greet: string) => `${greet}!!!`;
    output.textContent += greeting('こんにちは');
  },
  genericfunctions: (): void => {
    const output: HTMLElement = document.querySelector('.example.genericfunctions .output') as HTMLElement;
    const sample1 = [[1, 2, 3, 4, 5], 'Hello', ['A', 'B', 'C']];
    sample1.forEach(s => {
      output.innerHTML += `${s.toString()}<br />`;
    });
    const result = countAll(sample1);
    output.innerHTML += result;
  },
  optionalparameters: (): void => {
    const callback = (message: string, echodate?: Date): void => {
      const output = document.querySelector('.example.optionalparameters .output');
      output!.innerHTML += `${message}<br/>${echodate?.toString()}`;
    };
    sampleEcho('Hello optional parameters', callback);
  },
  declaringthis: (): void => {
    const teacher: Teacher = {
      students: [
        { name: 'Taro' }, { name: 'Mike' }, { name: 'Momo' }
      ],
      collectStudents: function(filter: (s: Student) => boolean): Student[] {
        const results: Student[] = [];
        // thisにアクセスするにはfunction文を使う必要がある。
        for (const student of this.students) {
          if (filter(student)) {
            results.push(student);
          }
        }
        return results;
      }
    };
    const results: Student[] = teacher.collectStudents(function (s: Student) {
      return s.name.startsWith('M');
    });
    const output = document.querySelector('.example.declaringthis .output');
    output!.textContent += results.map((result: Student) => result.name).join(',');
  }
};

// entry point
Object.values(funcs).forEach(f => f());