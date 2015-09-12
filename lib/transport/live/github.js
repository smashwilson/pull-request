"use babel";

import GitHubClient from "node-github";
import package from "../../../package.json";

import Fork from "../../models/fork";

var github = new GitHubClient({
  version: "3.0.0",
  debug: true,
  headers: {
    "user-agent": `atom-pull-request/${package.version}` // GitHub is happy with a unique user agent
  }
});)

module.exports = {
  getImportantForks: function (repository, callback) {
    let makeFork = function (repo) {
      return new Fork(repository, repo.full_name, repo.default_branch);
    };

    github.repos.get(repository.originID(), (err, repo) => {
      if (err) return callback(err);

      callback(null, {
        current: makeFork(repo),
        source: makeFork(repo.source)
      });
    })
  },

  getAvailableForks: function (repository, callback) {
  },

  getAvailableBranches: function (fork, callback) {
  },
};
