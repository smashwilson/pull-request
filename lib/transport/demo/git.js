"use babel";

module.exports = {
  getOriginURL: function (repository, callback) {
    callback(null, "git@github.com:username/the-repo.git");
  },

  getCurrentBranch: function (repository, callback) {
    callback(null, "feature-branch");
  }
};
