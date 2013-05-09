export module Logging {
  export class Logger {
    static log(txt: string): void {
      if (print && Object.prototype.toString.call(print) === "[object Function]") {
        print(txt);
      } else {
        console.log(txt);
      }
    }
  }
}

