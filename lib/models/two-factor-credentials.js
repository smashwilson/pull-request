"use babel";

export default class TwoFactorCredentials {

  constructor(options) {
    this.code = options.code || "";

    this.verifyCallback = () => {
      // no-op
    };
  }

  isValid() {
    return false;
  }

  canVerify() {
    return false;
  }

  verify() {
    //
  }

};
