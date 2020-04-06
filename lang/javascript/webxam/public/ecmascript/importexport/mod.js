class MyModule {
  constructor(word) {
    this.word = word;
  }

  toUpper() {
    return this.word.toUpperCase();
  }

  toLower() {
    return this.word.toLowerCase();
  }
}

export default MyModule;
