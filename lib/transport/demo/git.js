"use babel";

module.exports = {
  getCurrentBranch: function (repository, callback) {
    return callback(null, "feature-branch");
  },
};
