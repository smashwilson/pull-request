"use babel";
/** @jsx etch.dom */

import etch from 'etch';

export default class TwoFactorCredentialsComponent {

  constructor({comment}) {
    this.comment = comment;

    etch.createElement(this);
  }

  render() {
    return (
      <div className="two-factor-credentials">
      </div>
    )
  }
}
