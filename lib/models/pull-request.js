"use babel";

import Fork from './fork';

export const State = {
  DRAFT: "DRAFT",
  OPEN: "OPEN",
  CLOSED: "CLOSED",
  MERGED: "MERGED"
};

export default class PullRequest {

  constructor(repo, baseFork, baseBranch, headFork, headBranch) {
    this.title = "";
    this.description = "";

    this.repository = repo;
    this.state = State.DRAFT;

    this.baseFork = baseFork;
    this.baseBranch = baseBranch;

    this.headFork = headFork;
    this.headBranch = headBranch;

    this.commits = [];
    this.comments = [];
  }

  submit(callback) {
    //
  }

  update(callback) {
    //
  }

  close(callback) {
    //
  }

  merge(callback) {
    //
  }

  refresh(callback) {
    //
  }

  toString() {
    return `<PullRequest title="${this.title}" state="${this.state}">`
  }

}
