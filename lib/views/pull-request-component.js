"use babel";
/** @jsx etch.dom */

import etch from 'etch';
import TargetComponent from './target-component';
import DiscussionComponent from './discussion-component';
import CommitListComponent from './commit-list-component';

export default class PullRequestComponent {

  constructor({repository}) {
    this.repository = repository;
    this.activeTab = DiscussionComponent;

    etch.createElement(this);
  }

  render() {
    let pullRequest = this.repository.currentPullRequest();
    let ActiveTabComponent = this.activeTab;

    return (
      <div className="pull-request">
        <TargetComponent pullRequest={pullRequest} />
        <ActiveTabComponent pullRequest={pullRequest} />
      </div>
    )
  }

  static fromModel(repository) {
    return new PullRequestComponent({repository});
  }

}
