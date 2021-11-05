/* eslint-disable linebreak-style */

class ErrorNotCorrectDataForLogin extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

module.exports = ErrorNotCorrectDataForLogin;
