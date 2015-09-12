"use babel";

module.exports = {
  originURL: "git@github.com:username/the-repo.git",
  currentBranch: "feature-branch",

  getOriginURL: function (repository, callback) {
    callback(null, this.originURL);
  },

  getCurrentBranch: function (repository, callback) {
    callback(null, this.currentBranch);
  }
};
