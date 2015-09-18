"use babel";
/** @jsx etch.dom */

import etch from 'etch';

function shortenRef(refname) {
  return refname.replace(/^refs\/(heads|tags|remotes)\//, '');
}

export default class TargetComponent {

  constructor({pullRequest}) {
    this.pullRequest = pullRequest;

    etch.createElement(this);
  }

  render() {
    let base = `${this.pullRequest.baseFork.user}:${shortenRef(this.pullRequest.baseBranch)}`;
    let head = `${this.pullRequest.headFork.user}:${shortenRef(this.pullRequest.headBranch)}`;

    return (
      <div className="target">
        <span className="icon icon-git-pull-request inline-block-tight" />
        <span className="base inline-block-tight highlight-info">{base}</span>
        <span className="icon icon-arrow-left inline-block-tight" />
        <span className="head inline-block-tight highlight-info">{head}</span>
      </div>
    )
  }
}
