"use babel"

export default class BasicCredentials {

  constructor(options) {
    this.username = options.username || "";
    this.password = options.password || "";

    this.signInCallback = () => true;
    this.cancelCallback = () => true;
  }

  canSignIn() {
    return this.username.length > 0 && this.password.length > 0;
  }

  signIn() {
    this.signInCallback(this);
  }

  cancel() {
    this.cancelCallback(this);
  }

};
