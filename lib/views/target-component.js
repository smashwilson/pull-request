"use babel";
/** @jsx etch.dom */

import etch from 'etch';

export default class TargetComponent {

  constructor({pullRequest}) {
    this.pullRequest = pullRequest;
  }

  render() {
    return (
      <div className="target">
      </div>
    )
  }
}
