"use babel";

import async from 'async';

import Fork from '../../models/fork';

module.exports = {
  currentForkName: "username/the-repo",
  sourceForkName: "the-repo/the-repo",
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
    callback(null, {
      current: new Fork(repository, this.currentForkName, "master"),
      source: new Fork(repository, this.sourceForkName, "master")
    });
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
      case this.sourceForkName:
        choice = options.source;
        break;
      case this.currentForkName:
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
