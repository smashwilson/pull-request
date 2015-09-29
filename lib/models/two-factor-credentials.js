"use babel";

export default class TwoFactorCredentials {

  constructor(options) {
    this.code = options.code || "";

    this.verifyCallback = () => {
      // no-op
    };
  }

  isValid() {
    return /^\d{0,6}$/.test(this.code);
  }

  canVerify() {
    return /^\d{6}$/.test(this.code);
  }

  verify() {
    this.verifyCallback(this);
  }

};
