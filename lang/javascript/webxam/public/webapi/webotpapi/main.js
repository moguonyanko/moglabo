/**
 * @fileoverview Web OTP API調査用スクリプト
 * 参考:
 * https://web.dev/sms-otp-form/
 */

class MyOtp {
  constructor() {
    this.abortControler = new AbortController();
  }

  // async get code()とは記述できない。
  async getCode() {
    try {
      const otp = navigator.credentials.get({
        otp: { transport: ['sms'] },
        signal: this.abortControler.signal
      });
      const { code, type } = otp;
      console.log(`OTP Result:TYPE=${type},CODE=${code}`);
      return code;
    } catch (err) {
      this.abort();
      throw err;
    }
  }

  abort() {
    this.abortControler.abort();
    console.log(`Aborted: ${new Date().toString()}`);
  }
}

// eslint-disable-next-line no-unused-vars
const runTest = async () => {
  const otp = new MyOtp();
  const code = await otp.getCode();
  console.assert(code, `${code} is invalid`);
};

// DOM

class OtpInputElement extends HTMLInputElement {
  constructor() {
    super();
    this.otp = new MyOtp();
    this.setAttribute('name', 'code');
  }

  init() {
    this.setAttribute('type', 'text');
    this.setAttribute('inputmode', 'numeric');
    this.setAttribute('autocomplete', 'one-time-code');
    this.setAttribute('pattern', '\\d{6}');
  }

  async receive() {
    const code = await this.otp.getCode();
    this.value = code;
    this.form.submit();
  }

  connectedCallback() {
    // 手動でformのsubmitが実行されないようにする。
    this.form.addEventListener('submit', () => {
      this.otp.abort();
    });
    //this.receive();
  }
}

const main = () => {
  if ('OTPCredential' in window) {
    //await runTest();
    const customName = 'otp-input';
    customElements.define(customName, OtpInputElement, {
      extends: 'input'
    });    
    const runner = document.querySelector('#runner');
    runner.addEventListener('click', () => {
      const input = document.querySelector(`input[is="${customName}"]`);
      input.receive();
    });
  } else {
    alert('OTPCredential is not found');
  }
};

main();
