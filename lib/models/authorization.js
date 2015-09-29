"use babel";

import BasicCredentials from './basic-credentials';
import TwoFactorCredentials from './two-factor-credentials';

export default class Authorization {

  constructor() {
    this.token = null;

    this.basicPanel = null;
    this.twoPanel = null;
  }

  create(callback) {
    basic = new BasicCredentials({});
    basic.signInCallback = (basic) => this._acceptBasic(basic, callback);

    this.basicPanel = atom.workspace.addModalPanel({item: basic});
  }

  _acceptBasic(basic, callback) {
    console.log(`Basic auth: ${basic.username} + ${basic.password}`);
  }

  _acceptTwoFactor(two, callback) {
    //
  }

  apply(github) {
    github.authenticate({
      type: "oauth",
      token: this.token
    });
  }

};
