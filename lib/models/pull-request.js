"use babel";

import Fork, {loadingFork} from './fork';

class PullRequestState {

  constructor(name) {
    this.name = name;
  }

  when(actions) {
    let chosen = actions[this.name.toLowerCase()] || actions.default || () => {
      throw new Error(`Unexpected pull request state: ${this.name}`);
    };

    return chosen();
  }

  toString() {
    return `<State: ${this.name}>`;
  }
}

export const State = {
  BUSY: new PullRequestState("BUSY"),
  DRAFT: new PullRequestState("DRAFT"),
  OPEN: new PullRequestState("OPEN"),
  CLOSED: new PullRequestState("CLOSED"),
  MERGED: new PullRequestState("MERGED")
};

export default class PullRequest {

  constructor(repo, baseFork, baseBranch, headFork, headBranch) {
    this.title = "";
    this.body = "";

    this.repository = repo;
    this.state = State.DRAFT;

    this.baseFork = baseFork;
    this.baseBranch = baseBranch;

    this.headFork = headFork;
    this.headBranch = headBranch;

    this.commits = [];
    this.comments = [];
  }

  refresh(callback) {
    let noop = () => {
      return callback(null);
    }

    this.state.when({
      draft: noop
    });
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

  toString() {
    return `<PullRequest title="${this.title}" state="${this.state}">`
  }

}

export const loadingPullRequest = {
  title: "",
  description: "",
  state: State.BUSY,
  commits: [],
  comments: [],

  baseFork: loadingFork,
  baseBranch: "..",
  headFork: loadingFork,
  headBranch: "..",

  toString: function () {
    return "<LoadingPullRequest>";
  }
}
