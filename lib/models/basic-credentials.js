"use babel"

import {Emitter} from 'atom';

export default class BasicCredentials {

  constructor(options) {
    this.emitter = new Emitter();

    this.username = options.username || "";
    this.password = options.password || "";
    this.errorMessage = null;

    this.signInCallback = () => true;
    this.cancelCallback = () => true;
  }

  onDidReportError(callback) {
    return this.emitter.on("did-report-error", callback);
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

  reportError(message) {
    if (message !== this.errorMessage) {
      this.errorMessage = message;
      this.emitter.emit("did-report-error", this.errorMessage);
    }
  }

};
