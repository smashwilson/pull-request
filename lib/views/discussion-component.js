"use babel";
/** @jsx etch.dom */

import etch from 'etch';

import DetailComponent from './detail-component';
import CommentListComponent from './comment-list-component';

export default class DiscussionComponent {

  constructor({pullRequest}) {
    this.pullRequest = pullRequest;

    etch.createElement(this);
  }

  render() {
    return (
      <div className="discussion">
        <DetailComponent pullRequest={this.pullRequest} />
        <CommentListComponent pullRequest={this.pullRequest} />
      </div>
    )
  }
}
