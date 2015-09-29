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
    return this.username.length > 0 && this.password.length > 0;
  }

  canSignIn() {
    return this.isValid();
  }

  signIn() {
    this.signInCallback(this.username, this.password);
  }

};
