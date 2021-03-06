"use babel";
/** @jsx etch.dom */

import etch from 'etch';
import DOMListener from 'dom-listener';
import {CompositeDisposable} from 'atom';

export default class BasicCredentialsComponent {

  constructor({basicCredentials}) {
    this.subs = new CompositeDisposable();

    this.basic = basicCredentials;

    etch.createElement(this);

    this.listener = new DOMListener(this.element);
    this.subs.add(this.listener.add('.btn.cancel', 'click', this.handleCancel.bind(this)));
    this.subs.add(this.listener.add('.btn.sign-in', 'click', this.handleSignIn.bind(this)));
    this.subs.add(this.listener.add('input.username', 'input', this.handleTypeUsername.bind(this)));
    this.subs.add(this.listener.add('input.password', 'input', this.handleTypePassword.bind(this)));

    this.subs.add(this.basic.onDidReportError(() => etch.updateElement(this)));
  }

  handleTypeUsername(e) {
    this.basic.username = e.target.value;

    return etch.updateElement(this);
  }

  handleTypePassword(e) {
    this.basic.password = e.target.value;

    return etch.updateElement(this);
  }

  handleCancel() {
    this.basic.cancel();
  }

  handleSignIn() {
    if (! this.basic.canSignIn()) {
      this.basic.errorMessage = "Please specify both a username and a password.";
      return;
    }

    this.basic.signIn();
  }

  render() {
    let errorElement;
    if (this.basic.errorMessage && this.basic.errorMessage.length > 0) {
      errorElement = <ul className="error-messages block">
          <li>
            <span className="icon icon-alert"></span>
            <span className="msg">{this.basic.errorMessage}</span>
          </li>
        </ul>;
    }

    let disableSignIn = ! this.basic.canSignIn();

    return (
      <div className="basic-credentials credentials padded">
        <p className="block explanation">
          Please provide your GitHub credentials.
        </p>
        {errorElement}
        <div className="field block">
          <input type="text" className="username native-key-bindings" placeholder="username" value={this.basic.username}></input>
        </div>
        <div className="field block">
          <input type="password" className="password native-key-bindings" placeholder="password" value={this.basic.password}></input>
        </div>
        <div className="controls block padded pull-right">
          <button className="cancel btn inline-block-tight">Cancel</button>
          <button className="sign-in btn btn-primary inline-block-tight" disabled={disableSignIn}>Sign In</button>
        </div>
      </div>
    );
  }

  static fromModel(basicCredentials) {
    return new BasicCredentialsComponent({basicCredentials});
  }
}
