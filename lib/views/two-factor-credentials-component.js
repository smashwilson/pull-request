"use babel";
/** @jsx etch.dom */

import etch from 'etch';

export default class TwoFactorCredentialsComponent {

  constructor({twoFactorCredentials}) {
    this.two = twoFactorCredentials;

    etch.createElement(this);
    this.register();
  }

  register() {
    console.log("Registering new event listeners");
    this.refs.cancelButton.addEventListener('click', this.handleCancel.bind(this));
    this.refs.verifyButton.addEventListener('click', this.handleVerify.bind(this));
    this.refs.codeField.addEventListener('input', this.handleType.bind(this));
  }

  handleType() {
    console.log("Input event received");
    this.two.code = this.refs.codeField.value;

    return this.revalidate();
  }

  handleCancel() {
    //
  }

  handleVerify() {
    if (! this.two.canVerify() || ! this.two.isValid()) {
      return;
    }

    this.two.verify();
  }

  revalidate() {
    return etch.updateElement(this);
  }

  render() {
    let errorElement;
    let hasValidationError = ! this.two.isValid();
    let hasErrorMessage = this.two.errorMessage && this.two.errorMessage.length > 0;

    console.log(`hasValidationError: ${hasValidationError} this.two.code: ${this.two.code}`);

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
          <button className="cancel btn inline-block-tight" ref="cancelButton">Cancel</button>
          <button className="verify btn btn-primary inline-block-tight" disabled={disableVerify} ref="verifyButton">Verify</button>
        </div>
      </div>
    );
  }

  static fromModel(twoFactorCredentials) {
    return new TwoFactorCredentialsComponent({twoFactorCredentials});
  }
}
