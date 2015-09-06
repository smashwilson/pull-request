"use babel";
/** @jsx etch.dom */

import etch from 'etch';

export default class CommitListComponent {

  constructor({pullRequest}) {
    this.pullRequest = pullRequest;
  }

  render() {
    return (
      <div className="commitList">
      </div>
    )
  }
}
