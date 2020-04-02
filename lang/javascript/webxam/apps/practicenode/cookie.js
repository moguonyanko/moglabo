/**
 * @fileoverview CookieをNodeで扱う練習用スクリプト
 */

/* eslint-disable no-undef */

const cookieParser = require('cookie-parser');

class MyCookie {
  #request;
  #response;

  constructor({ request, response }) {
    this.#request = request;
    this.#response = response;
  }

  echo() {
    const cookies = this.#request.cookies;
    const signedCookies = this.#request.signedCookies;

    return {
      cookies, signedCookies
    };
  }

  get sampleUser() {
    const user = {
      name: 'Sample User',
      age: 39
    };

    const value = `${user.name}_${user.age}`;
    const option =  { 
      //expires: new Date(Date.now() + 900000), 
      httpOnly: true,
      secure: true,
      signed: true,
      sameSite: 'None'
    };

    this.#response.cookie('sampleUser', value, option);

    return user;
  }
}

module.exports = MyCookie;
