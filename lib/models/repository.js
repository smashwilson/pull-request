"use babel";

import PullRequest from './pull-request';
import Commit from './commit';
import Fork from './fork';

export default class Repository {

  constructor(transport) {
    this.tranport = transport;
  }

  rootFork() {
    return new Fork("the-repo/the-repo");
  }

  currentFork() {
    return new Fork(
      "username/the-repo",
      "git@github.com:username/the-repo.git"
    );
  }

  currentBranch() {
    return "feature";
  }

  availableForks(callback) {
    callback(null, [this.rootFork(), this.currentFork()]);
  }

  currentPullRequest() {
    let rootFork = this.rootFork();
    let currentFork = this.currentFork();

    let pr = new PullRequest(
      this,
      rootFork, rootFork.defaultBranch(),
      currentFork, this.currentBranch()
    );

    let c1 = new Commit("aaa111", "First", "The first commit");
    let c2 = new Commit("bbb222", "Second", "The second commit");
    let c3 = new Commit("ccc333", "Third", "The third commit");

    pr.commits = [c1, c2, c3];

    return pr;
  }

  toString() {
    return `<Repository fork="${this.currentFork().name}">`;
  }

}
