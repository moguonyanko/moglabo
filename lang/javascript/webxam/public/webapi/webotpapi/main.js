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
      return otp.code;
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

const runTest = async () => {
  const otp = new MyOtp();
  const code = await otp.getCode();
  console.assert(code, `${code} is invalid`);
};

// DOM

const prepareOtp = async otp => {
  const form = document.querySelector('form');
  form.addEventListener('submit', async () => {
    otp.abort();
  });
  const input = form.querySelector('input[autocomplete="one-time-code"]');
  try {
    const code = await otp.getCode();
    input.value = code;
    form.submit();
  } catch (err) {
    input.value = `ERROR: ${err.message}`;
  }
};

const main = async () => {
  if ('OTPCredential' in window) {
    await runTest();
    prepareOtp(new MyOtp());
  } else {
    alert('OTPCredential is not found');
  }
};

main().then();
