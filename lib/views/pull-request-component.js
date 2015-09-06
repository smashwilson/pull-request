"use babel";
/** @jsx etch.dom */

import etch from 'etch';
import SummaryComponent from './summary-component';

export default class PullRequestComponent {

  constructor({repository}) {
    this.repository = repository;

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

  static fromModel(repository) {
    return new PullRequestComponent({repository});
  }

}
