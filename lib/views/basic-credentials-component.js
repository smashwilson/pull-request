"use babel";
/** @jsx etch.dom */

import etch from 'etch';

export default class BasicCredentialsComponent {

  constructor({comment}) {
    this.comment = comment;

    etch.createElement(this);
  }

  render() {
    return (
      <div className="basic-credentials">
      </div>
    )
  }
}
