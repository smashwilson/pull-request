"use babel";

function forkSwitch(fork, options, callback) {
  let err, choice;
  switch (fork.name) {
    case "the-repo/the-repo":
      choice = options.root;
      break;
    case "username/the-repo":
      choice = options.username;
      break;
    case "another/the-repo":
      choice = options.another;
      break;
    default:
      err = new Error(`Unrecognized fork: ${fork}`);
  }

  if (!choice) {
    err = new Error(`Unsupported fork: ${fork}`);
  }

  if (err) {
    if (callback) {
      return callback(err);
    }
    throw err;
  }

  if (callback) {
    return callback(null, choice);
  }
  return choice;
}

module.exports = {
  getRootFork: function (repository, callback) {
    callback(null, new Fork(repository, "the-repo/the-repo"));
  },

  getCurrentFork: function (repository, callback) {
    callback(null, new Fork(repository, "username/the-repo"));
  },

  getAvailableForks: function (repository, callback) {
    callback(null, [
      new Fork(repository, "the-repo/the-repo", "master"),
      new Fork(repository, "username/the-repo", "master"),
      new Fork(repository, "another/the-repo", "someone-elses-work")
    ]);
  },

  getAvailableBranches: function (fork, callback) {
    forkSwitch(fork, {
      root: ["master", "ongoing-work"],
      username: ["master", "feature-branch", "other-branch"],
      another: ["master", "someone-elses-work"]
    }, callback);
  },
};
