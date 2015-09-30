"use babel";

import etch from 'etch';
import BasicCredentials from './basic-credentials';
import TwoFactorCredentials from './two-factor-credentials';

export default class Authorization {

  constructor(transport) {
    this.github = transport.github;
    this.username = null;
    this.token = null;

    this.basicPanel = null;
    this.twoPanel = null;
  }

  populate(username, token) {
    this.username = username;
    this.token = token;
  }

  create(callback) {
    let basic = new BasicCredentials({});
    basic.signInCallback = (basic) => this._acceptBasic(basic, callback);
    basic.cancelCallback = this._cancel.bind(this);

    this.basicPanel = atom.workspace.addModalPanel({item: basic});
  }

  _acceptBasic(basic, callback) {
    this._createToken(basic, null, (err, res) => {
      if (err) {
        let msg = this._errMessage(err);

        // TODO Send a pull request to node-github to preserve response headers in errors.
        if (/two-factor/.test(msg)) {
          // Two-factor authentication needed.
          let two = new TwoFactorCredentials({});
          two.verifyCallback = (two) => this._acceptTwoFactor(basic, two, callback);
          two.cancelCallback = this._cancel.bind(this);

          this.twoPanel = atom.workspace.addModalPanel({item: two});

          return;
        }

        basic.password = "";
        basic.reportError(msg);
        return;
      }

      this.populate(basic.username, res.token);

      this.basicPanel.destroy();
      this.basicPanel = null;

      callback(null, this);
    });
  }

  _acceptTwoFactor(basic, two, callback) {
    this._createToken(basic, two, (err, res) => {
      if (err) {
        two.code = "";
        two.reportError(this._errMessage(err));
        return;
      }

      this.populate(basic.username, res.token);

      this.twoPanel.destroy();
      this.twoPanel = null;

      callback(null, this);
    });
  }

  _cancel() {
    if (this.basicPanel) {
      this.basicPanel.destroy();
    }

    if (this.twoPanel) {
      this.twoPanel.destroy();
    }
  }

  _createToken(basic, two, callback) {
    let args = {
      scopes: ["repo"],
      note: "Atom pull-request package"
    };

    if (two) {
      args.headers = {
        "X-GitHub-OTP": two.code
      };
    }

    this.github.createAuthorization(basic.username, basic.password, args, callback);
  }

  _errMessage(err) {
    try {
      return JSON.parse(err.message).message;
    } catch (e) {
      return err.message;
    }
  }

  apply(github) {
    github.authenticate({
      type: "oauth",
      token: this.token
    });
  }

};
