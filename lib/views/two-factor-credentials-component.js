"use babel";
/** @jsx etch.dom */

import etch from 'etch';

export default class TwoFactorCredentialsComponent {

  constructor({twoFactorCredentials}) {
    this.two = twoFactorCredentials;

    etch.createElement(this);
  }

  revalidate() {
    return etch.updateElement(this);
  }

  render() {
    let errorElement;
    let hasValidationError = ! this.two.isValid();
    let hasErrorMessage = this.two.errorMessage && this.two.errorMessage.length > 0;

    if (hasValidationError || hasErrorMessage) {
      let messageElements = [];

      let pushMessage = (msg) => {
        messageElements.push(<li>
            <span className="icon icon-alert"></span> <span className="msg">{msg}</span>
          </li>);
      };

      if (hasValidationError) {
        pushMessage("Please specify a six-digit two-factor authentication code.");
      }

      if (hasErrorMessage) {
        pushMessage(this.two.errorMessage);
      }

      errorElement = <ul className="error-messages block">{messageElements}</ul>;
    }

    let disableVerify = ! this.two.canVerify();

    return (
      <div className="two-factor-credentials">
        {errorElement}
        <input type="text" className="code block" value={this.two.code}></input>
        <div className="controls block padded pull-right">
          <button className="cancel btn" ref="cancelButton">Cancel</button>
          <button className="verify btn btn-primary" disabled={disableVerify} ref="verifyButton">Verify</button>
        </div>
      </div>
    );
  }
}
