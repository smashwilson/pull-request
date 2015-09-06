"use babel";
/** @jsx etch.dom */

import etch from 'etch';

export default class ActionComponent {

  constructor({pullRequest}) {
    this.pullRequest = pullRequest;
  }

  render() {
    return (
      <div className="action">
      </div>
    )
  }
}
