"use babel"

export default class BasicCredentials {

  constructor(options) {
    this.username = options.username || "";
    this.password = options.password || "";

    this.signInCallback = () => {
      // no-op
    };
  }

  canSignIn() {
    return this.username.length > 0 && this.password.length > 0;
  }

  signIn() {
    this.signInCallback(this.username, this.password);
  }

};
