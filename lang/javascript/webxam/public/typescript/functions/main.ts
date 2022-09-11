/**
 * @fileoverview 関数調査用スクリプト
 */

type Greeting = { 
  (greet: string): string 
};

const funcs = {
  callsignatures: (): void => {
    const output: HTMLElement = document.querySelector('.example.callsignatures .output') as HTMLElement;
    const greeting: Greeting = (greet: string) => `${greet}!!!`;
    output.textContent += greeting('こんにちは');
  }
};

// entry point
Object.values(funcs).forEach(f => f());