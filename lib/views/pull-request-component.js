"use babel";
/** @jsx etch.dom */

import etch from 'etch';
import TargetComponent from './target-component';
import DiscussionComponent from './discussion-component';
import CommitListComponent from './commit-list-component';

import {loadingPullRequest} from '../models/pull-request';

export default class PullRequestComponent {

  constructor({repository}) {
    this.repository = repository;
    this.pullRequest = loadingPullRequest;
    this.activeTab = DiscussionComponent;

    etch.createElement(this);

    this.refs.discussionTab.addEventListener('click', this.handleDiscussion.bind(this));
    this.refs.commitListTab.addEventListener('click', this.handleCommitList.bind(this));

    this.repository.currentPullRequest((err, pr) => {
      if (err) {
        console.error("Unable to fetch current pull request", err);
        return
      }

      this.pullRequest = pr;
      etch.updateElement(this);
    });
  }

  _chooseTab(componentTab) {
    if (this.activeTab === componentTab) {
      return;
    }

    this.activeTab = componentTab;
    etch.updateElement(this);
  }

  handleDiscussion() {
    this._chooseTab(DiscussionComponent);
  }

  handleCommitList() {
    this._chooseTab(CommitListComponent);
  }

  render() {
    let ActiveTabComponent = this.activeTab;

    return (
      <atom-panel className="pull-request right">
        <TargetComponent pullRequest={this.pullRequest} />
        {this.renderTabs()}
        <ActiveTabComponent pullRequest={this.pullRequest} />
      </atom-panel>
    )
  }

  renderTabs() {
    let discussionClasses = "discussion-tab";
    let commitListClasses = "commit-list-tab";

    if (this.activeTab === DiscussionComponent) {
      discussionClasses += " selected";
    }

    if (this.activeTab === CommitListComponent) {
      commitListClasses += " selected";
    }

    return (
      <ul className="tab-list">
        <li className={discussionClasses} ref="discussionTab">
          <span className="icon icon-comment-discussion" />
        </li>
        <li className={commitListClasses} ref="commitListTab">
          <span className="icon icon-git-commit" />
        </li>
      </ul>
    );
  }

  static fromModel(repository) {
    return new PullRequestComponent({repository});
  }

}
