"use babel";
/** @jsx etch.dom */

import etch from 'etch';
import SummaryComponent from './summary-component';

export default class PullRequestComponent {

  constructor({pullRequest}) {
    this.pullRequest = pullRequest;

    etch.createElement(this);
  }

  render() {
    return (
      <div className="pull-request">
        <h1>Pull Request</h1>
        <SummaryComponent pullRequest={this.pullRequest} />
      </div>
    )
  }

  static fromModel(pullRequest) {
    return new PullRequestComponent({pullRequest});
  }

}
