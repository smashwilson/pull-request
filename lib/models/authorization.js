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
    let basic = new BasicCredentials({});
    basic.signInCallback = (basic) => this._acceptBasic(basic, callback);

    this.basicPanel = atom.workspace.addModalPanel({item: basic});
  }

  _acceptBasic(basic, callback) {
    console.log(`Basic auth: ${basic.username} + ${basic.password}`);

    this.basicPanel.destroy();

    let two = new TwoFactorCredentials({});
    two.verifyCallback = (two) => this._acceptTwoFactor(two, callback);

    this.twoPanel = atom.workspace.addModalPanel({item: two});
  }

  _acceptTwoFactor(two, callback) {
    console.log(`Two-factor: ${two.code}`);

    this.twoPanel.destroy();
  }

  apply(github) {
    github.authenticate({
      type: "oauth",
      token: this.token
    });
  }

};
