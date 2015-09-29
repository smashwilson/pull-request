"use babel";
/** @jsx etch.dom */

import etch from 'etch';

export default class BasicCredentialsComponent {

  constructor({basicCredentials}) {
    this.basic = basicCredentials;

    etch.createElement(this);
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
      <div className="basic-credentials padded">
        {errorElement}
        <input type="text" className="username block" value={this.basic.username}></input>
        <input type="password" className="password block" value={this.basic.password}></input>
        <div className="controls block padded pull-right">
          <button className="cancel btn" ref="cancelButton">Cancel</button>
          <button className="sign-in btn btn-primary" disabled={disableSignIn} ref="signInButton">Sign In</button>
        </div>
      </div>
    );
  }
}
