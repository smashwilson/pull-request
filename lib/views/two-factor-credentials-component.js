"use babel";
/** @jsx etch.dom */

import etch from 'etch';
import DOMListener from 'dom-listener';

export default class TwoFactorCredentialsComponent {

  constructor({twoFactorCredentials}) {
    this.two = twoFactorCredentials;

    etch.createElement(this);

    // Register event listeners
    this.listener = new DOMListener(this.element);
    this.listener.add('.btn.cancel', 'click', this.handleCancel.bind(this));
    this.listener.add('.btn.verify', 'click', this.handleVerify.bind(this));
    this.listener.add('input.code', 'input', this.handleType.bind(this));
  }

  handleType(e) {
    this.two.code = e.target.value;

    return etch.updateElement(this);
  }

  handleCancel() {
    this.two.cancel();
  }

  handleVerify() {
    if (! this.two.canVerify() || ! this.two.isValid()) {
      return;
    }

    this.two.verify();
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
        pushMessage("Please specify a six-digit code.");
      }

      if (hasErrorMessage) {
        pushMessage(this.two.errorMessage);
      }

      errorElement = <ul className="error-messages block">{messageElements}</ul>;
    }

    let disableVerify = ! this.two.canVerify();

    return (
      <div className="two-factor-credentials credentials padded">
        <p className="block explanation">
          Please enter your current two-factor authentication code.
        </p>
        {errorElement}
        <div className="field block">
          <input type="text" className="code" placeholder="123456" value={this.two.code} ref="codeField"></input>
        </div>
        <div className="controls block padded pull-right">
          <button className="cancel btn inline-block-tight">Cancel</button>
          <button className="verify btn btn-primary inline-block-tight" disabled={disableVerify}>Verify</button>
        </div>
      </div>
    );
  }

  static fromModel(twoFactorCredentials) {
    return new TwoFactorCredentialsComponent({twoFactorCredentials});
  }
}
