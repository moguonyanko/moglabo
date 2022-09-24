/**
 * @fileoverview 関数調査用スクリプト
 */

type Greeting = { 
  (greet: string): string 
};

const countAll = <Type extends { length: number }>(target: Type[]): number => {
  return target.map((t: Type) => t.length).reduce((a: number, b: number) => a + b, 0);
};

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
  }
};

// entry point
Object.values(funcs).forEach(f => f());