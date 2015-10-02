"use babel";

import {Emitter} from 'atom';

export default class TwoFactorCredentials {

  constructor(options) {
    this.emitter = new Emitter();

    this.code = options.code || "";
    this.errorMessage = null;

    this.verifyCallback = () => true;
    this.cancelCallback = () => true;
  }

  onDidReportError(callback) {
    return this.emitter.on("did-report-error", callback);
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
