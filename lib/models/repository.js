"use babel";

import PullRequest from './pull-request';

class Fork {

  constructor(name, uri) {
    this.name = name;
    this.uri = uri;

    this.isRoot = false;
  }

  defaultBranch() {
    return "master";
  }

  availableBranches(callback) {
    callback(null, [this.defaultBranch()]);
  }

  toString() {
    return `<Fork name="${this.name}">`;
  }

}

export default class Repository {

  constructor() {
    //
  }

  rootFork() {
    return new Fork(
      "the-repo/the-repo",
      "git@github.com:the-repo/the-repo.git"
    );
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

    return new PullRequest(
      this,
      rootFork, rootFork.defaultBranch(),
      currentFork, this.currentBranch()
    );
  }

  toString() {
    return `<Repository fork="${this.currentFork().name}">`;
  }

}
