"use babel";

import async from "async";
import GitHubClient from "node-github";
import package from "../../../package.json";

var github = new GitHubClient({
  version: "3.0.0",
  debug: true,
  headers: {
    "user-agent": `atom-pull-request/${package.version}` // GitHub is happy with a unique user agent
  }
});

module.exports = {
  getImportantForks: function (repository, callback) {
    async.waterfall([
      (cb) => repository.originID(cb),
      (repoID, cb) => github.repos.get(repoID, cb)
    ], (err, repo) => {
      if (err) return callback(err);

      callback(null, {current: repo, source: repo.source || repo});
    });
  },

  getPullRequests: function (fork, query, callback) {
    query.user = fork.user;
    query.repo = fork.repo;

    github.pullRequests.getAll(query, callback);
  }
};
