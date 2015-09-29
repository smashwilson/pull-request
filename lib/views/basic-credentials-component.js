"use babel";
/** @jsx etch.dom */

import etch from 'etch';

export default class BasicCredentialsComponent {

  constructor({basicCredentials}) {
    this.basic = basicCredentials;

    etch.createElement(this);
    this.register();
  }

  register() {
    this.refs.cancelButton.addEventListener('click', this.handleCancel.bind(this));
    this.refs.signInButton.addEventListener('click', this.handleSignIn.bind(this));

    this.refs.usernameField.addEventListener('input', this.handleType.bind(this));
    this.refs.passwordField.addEventListener('input', this.handleType.bind(this));
  }

  handleType() {
    this.basic.username = this.refs.usernameField.value;
    this.basic.password = this.refs.passwordField.value;

    return this.revalidate();
  }

  handleCancel() {
    //
  }

  handleSignIn() {
    if (! this.basic.canSignIn()) {
      this.basic.errorMessage = "Please specify both a username and a password.";
      return;
    }

    this.basic.signIn();
  }

  revalidate() {
    return etch.updateElement(this);
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
          <input type="text" className="username" placeholder="username" value={this.basic.username} ref="usernameField"></input>
        </div>
        <div className="field block">
          <input type="password" className="password" placeholder="password" value={this.basic.password} ref="passwordField"></input>
        </div>
        <div className="controls block padded pull-right">
          <button className="cancel btn inline-block-tight" ref="cancelButton">Cancel</button>
          <button className="sign-in btn btn-primary inline-block-tight" disabled={disableSignIn} ref="signInButton">Sign In</button>
        </div>
      </div>
    );
  }

  static fromModel(basicCredentials) {
    return new BasicCredentialsComponent({basicCredentials});
  }
}
