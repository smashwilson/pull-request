"use babel";

import {Emitter} from 'atom';

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

  apiString() {
    return this.name.toLowerCase();
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
  draft: State.DRAFT,
  open: State.OPEN,
  closed: State.CLOSED,
  merged: State.MERGED
};

export default class PullRequest {

  constructor(repo, baseFork, baseBranch, headFork, headBranch) {
    this.number = null;
    this.title = "";
    this.body = "";
    this.etag = null;

    this.repository = repo;
    this.github = this.repository.transport.github;
    this.state = State.DRAFT;

    this.baseFork = baseFork;
    this.baseBranch = baseBranch;

    this.headFork = headFork;
    this.headBranch = headBranch;

    this.commits = [];
    this.comments = [];

    this.emitter = new Emitter();
  }

  refresh(callback) {
    let noop = () => callback(null);

    let update = () => {
      this.github.getPullRequest(this.baseFork, this.number, this.etag, (err, attrs) => {
        if (err) return callback(err);

        this._applyAttrs(attrs);
        callback(null);
      });
    }

    this.state.when({
      busy: noop,
      draft: noop,
      default: update
    });
  }

  onDidChangeState(callback) {
    return this.emitter.on("did-change-state", callback);
  }

  transitionTo(newState) {
    if (newState !== this.state) {
      this.state = newState;
      this.emitter.emit("did-change-state", this.state);
    }
  }

  submit(callback) {
    this.state.when({
      open: () => callback(null)
    });
  }

  update(attrs, callback) {
    let applyDirectly = () => {
      this._applyAttrs(attrs);
      callback(null);
    };

    let useTransport = () => {
      this.github.updatePullRequest(this.baseFork, this.number, attrs, this.etag, (err, nattrs) => {
        if (err) return callback(err);

        this._applyAttrs(nattrs);
        callback(null);
      });
    };

    this.state.when({
      draft: applyDirectly,
      default: useTransport
    });
  }

  close(callback) {
    //
  }

  merge(callback) {
    //
  }

  _applyAttrs(attrs) {
    if (attrs.title) this.title = attrs.title;
    if (attrs.body) this.body = attrs.body;

    if (attrs.state) {
      let nState = stateNames[attrs.state];
      if (!nState) {
        console.error(`Unrecognized pull request state from API: ${attrs.state}`);
      } else {
        this.transitionTo(nState);
      }
    }

    if (attrs.meta && attrs.meta.etag) {
      this.etag = attrs.meta.etag;
    }
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
