let s: string = 'Hello';

console.log(`${s} TypeScript`);

const obj = { a: 1, b: 2 } as const;
// Error
// obj.a = 1;
