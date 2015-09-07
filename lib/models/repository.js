"use babel";

import PullRequest from './pull-request';

export class Fork {

  constructor(name) {
    this.name = name;
    this.isRoot = false;
  }

  uri() {
    return `git@github.com:${this.name}.git`;
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
