/// <reference path="util.d.ts" />

module Logging {
  export class Logger {
    static log(txt: string): void {
      if (print && typeof print === "function") {
        print(txt);
      }
    }
  }
}
