"use babel";

import git from 'nodegit';

let Repository = git.Repository;
let Remote = git.Remote;

module.exports = {
  getOriginURL: function (repository, callback) {
    Repository.open(repository.gitRepoPath)
      .then((repo) => Remote.lookup(repo, "origin"))
      .then((remote) => callback(null, remote.url()))
      .catch(callback);
  },

  getCurrentBranch: function (repository, callback) {
    Repository.open(repository.gitRepoPath)
      .then((repo) => repo.head())
      .then((ref) => callback(null, ref))
      .catch(callback);
  }
};
