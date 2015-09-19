"use babel";

import async from 'async';

module.exports = {
  currentFork: {
    full_name: "username/the-repo",
    default_branch: "master"
  },

  sourceFork: {
    full_name: "the-repo/the-repo",
    default_branch: "master"
  },

  sourcePullRequests: [
    {
      number: 123,
      title: "the title",
      body: "the body",
      state: "open",
      base: {
        ref: "base-ref",
        repo: {
          full_name: "the-repo/the-repo",
          default_branch: "master"
        }
      }
    }
  ],

  getImportantForks: function (repository, callback) {
    callback(null, {current: this.currentFork, source: this.sourceFork});
  },

  getPullRequest: function (fork, number, etag, callback) {
    let chosen;

    sourcePullRequests.forEach((each) => {
      if (each.number === number) {
        chosen = each;
      }
    });

    if (chosen) {
      return callback(null, chosen);
    }

    return callback(new Error(`No pull request with ID: ${id}`));
  },

  getPullRequests: function (fork, query, callback) {
    this._forkSwitch(fork.fullName, {
      source: this.sourcePullRequests,
      current: [],
      another: []
    }, callback);
  },

  updatePullRequest: function (fork, number, attrs, etag, callback) {
    this.getPullRequest(fork, number, (err, pr) => {
      if (err) return callback(err);

      pr.title = attrs.title || pr.title;
      pr.body = attrs.body || pr.body;
      pr.state = attrs.state || pr.state;

      callback(null, pr);
    });
  },

  _forkSwitch: function (forkName, options, callback) {
    let err, choice;
    switch (forkName) {
      case this.sourceFork.full_name:
        choice = options.source;
        break;
      case this.currentFork.full_name:
        choice = options.current;
        break;
      default:
        err = new Error(`Unrecognized fork: ${forkName}`);
    }

    if (err) {
      if (callback) return callback(err);
      throw err;
    }

    if (callback) return callback(null, choice);
    return choice;
  }
};
