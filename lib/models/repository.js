"use babel";

import async from 'async';

import PullRequest from './pull-request';
import Commit from './commit';
import Fork from './fork';

export default class Repository {

  constructor(project, transport) {
    this.project = project;
    this.tranport = transport;
  }

  rootFork(callback) {
    this.transport.github.getRootFork(this, callback);
  }

  currentFork(callback) {
    this.transport.github.getCurrentFork(this, callback);
  }

  currentBranch(callback) {
    this.transport.git.getCurrentBranch(this, callback);
  }

  availableForks(callback) {
    this.tranport.github.getAvailableForks(this, callback);
  }

  currentPullRequest(callback) {
    async.parallel({
      currentFork: this.currentFork.bind(this),
      currentBranch: this.currentBranch.bind(this),
      rootFork: this.rootFork.bind(this)
    }, (err, results) => {
      if (err) return callback(err);

      let pr = new PullRequest(
        this,
        results.rootFork, results.rootFork.defaultBranch,
        results.currentFork, results.currentBranch
      ));

      pr.refresh((err) => callback(err, pr));
    });
  }

  toString() {
    return `<Repository fork="${this.currentFork().name}">`;
  }

}
