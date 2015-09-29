"use babel"

export default class BasicCredentials {

  constructor(options) {
    this.username = options.username || "";
    this.password = options.password || "";

    this.signInCallback = () => {
      // no-op
    };
  }

  isValid() {
    return false;
  }

  canSignIn() {
    return false;
  }

  signIn() {
    //
  }

};
