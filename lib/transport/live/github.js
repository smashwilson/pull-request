"use babel";

import async from "async";
import GitHubClient from "node-github";
import package from "../../../package.json";

import Fork from "../../models/fork";

var github = new GitHubClient({
  version: "3.0.0",
  debug: true,
  headers: {
    "user-agent": `atom-pull-request/${package.version}` // GitHub is happy with a unique user agent
  }
});

function makeFork (repository, callback) {
  return new Fork(repository, repo.full_name, repo.default_branch);
}

module.exports = {
  getImportantForks: function (repository, callback) {
    async.waterfall([
      (cb) => repository.originID(cb),
      (repoID, cb) => github.repos.get(repoID, cb)
    ], (err, repo) => {
      if (err) return callback(err);

      callback(null, {
        current: makeFork(repo),
        source: makeFork(repo.source || repo)
      });
    });
  },

  getPullRequests: function (fork, query, callback) {
    query.user = fork.user;
    query.repo = fork.repo;

    github.pullRequests.getAll(query, callback);
  }
};
