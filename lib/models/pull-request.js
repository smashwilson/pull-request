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

const stateNames = {
  open: State.OPEN,
  closed: State.CLOSED,
  merged: State.MERGED
};

export default class PullRequest {

  constructor(repo, baseFork, baseBranch, headFork, headBranch) {
    this.number = null;
    this.title = "";
    this.body = "";

    this.repository = repo;
    this.github = this.repository.transport.github;
    this.state = State.DRAFT;

    this.baseFork = baseFork;
    this.baseBranch = baseBranch;

    this.headFork = headFork;
    this.headBranch = headBranch;

    this.commits = [];
    this.comments = [];
  }

  refresh(callback) {
    let noop = () => callback(null);

    let update = () => {
      this.github.getPullRequest(this.baseFork, this.number, (err, data) => {
        if (err) return callback(err);

        this.title = data.title;
        this.body = data.body;

        let nState = stateNames[data.state];
        if (!nState) {
          console.error(`Unrecognized pull request state from API: ${nState}`);
        } else {
          this.state = nState;
        }

        callback(null);
      });
    }

    this.state.when({
      busy: noop,
      draft: noop,
      default: update
    });
  }

  submit(callback) {
    //
  }

  update(attrs, callback) {
    let applyDirectly = () => {
      this.title = attrs.title;
      this.body = attrs.body;
      callback(null);
    };

    this.state.when({
      draft: applyDirectly
    });
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
