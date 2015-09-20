"use babel";
/** @jsx etch.dom */

import etch from 'etch';

export default class CommentListComponent {

  constructor({pullRequest}) {
    this.pullRequest = pullRequest;

    etch.createElement(this);
  }

  render() {
    return (
      <ol className="comment-list">
      </ol>
    )
  }
}
