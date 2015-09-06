"use babel";
/** @jsx etch.dom */

import etch from 'etch';

export default class CommitListComponent {

  constructor({pullRequest}) {
    this.pullRequest = pullRequest;

    etch.createElement(this);
  }

  render() {
    return (
      <div className="commit-list">
      </div>
    )
  }
}
