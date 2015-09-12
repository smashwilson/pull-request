"use babel";

import async from 'async';

import PullRequest, {State} from './pull-request';
import Commit from './commit';
import Fork from './fork';

const SSH_URL_PATTERN = /^git@github\.com:([^\/]+)\/(.+?)\.git$/;
const HTTPS_URL_PATTERN = /^https:\/\/github\.com\/([^\/]+)\/(.+?)\.git$/;

export default class Repository {

  constructor(gitRepoPath, transport) {
    this.gitRepoPath = gitRepoPath;
    this.transport = transport;
  }

  originID(callback) {
    this.transport.git.getOriginURL(this, (err, u) => {
      if (err) return callback(err);

      let sshMatch = SSH_URL_PATTERN.exec(u);
      if (sshMatch) {
        return callback(null, {user: sshMatch[1], repo: sshMatch[2]});
      }

      let httpsMatch = HTTPS_URL_PATTERN.exec(u);
      if (httpsMatch) {
        return callback(null, {user: httpsMatch[1], repo: httpsMatch[2]});
      }

      callback(new Error(`${u} doesn't look like a GitHub repository`));
    });
  }

  importantForks(callback) {
    let makeFork = (result) => new Fork(this, result.full_name, result.default_branch);

    this.transport.github.getImportantForks(this, (err, results) => {
      if (err) return callback(err);

      callback(null, {
        current: makeFork(results.current),
        source: makeFork(results.source)
      });
    });
  }

  currentBranch(callback) {
    this.transport.git.getCurrentBranch(this, callback);
  }

  availableForks(callback) {
    this.transport.github.getAvailableForks(this, callback);
  }

  currentPullRequest(callback) {
    async.parallel({
      forks: this.importantForks.bind(this),
      currentBranch: this.currentBranch.bind(this)
    }, (err, results) => {
      if (err) return callback(err);

      let currentFork = results.forks.current;
      let sourceFork = results.forks.source;

      this.transport.github.getPullRequests(sourceFork, {
        state: "open",
        head: `${currentFork.user}:${results.currentBranch}`,
      }, (err, response) => {
        if (err) return callback(err);

        if (response.length > 0) {
          let first = response[0];

          let existing = new PullRequest(
            this,
            sourceFork, first.base.ref,
            currentFork, results.currentBranch
          );
          existing.state = State.OPEN;
          existing.title = first.title;
          existing.body = first.body;

          callback(null, existing);
        }
      });
    });
  }

  toString() {
    return `<Repository path="${this.gitRepoPath}">`;
  }

}
