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

  getPullRequest: function (fork, id, callback) {
    let chosen;

    sourcePullRequests.forEach((each) => {
      if (each.number === id) {
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
