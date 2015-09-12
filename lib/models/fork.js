"use babel";

FORK_NAME = /^([^/]+)\/(.+)$/;

export default class Fork {

  constructor(repository, name, defaultBranch) {
    this.github = repository.transport.github;

    let m = FORK_NAME.exec(name);
    if (m) {
      this.fullName = name;
      this.user = m[1];
      this.repo = m[2];
    } else {
      this.fullName = `${name}/${name}`;
      this.user = name;
      this.repo = name;
    }

    this.defaultBranch = defaultBranch;
  }

  uri() {
    return `git@github.com:${this.fullName}.git`;
  }

  availableBranches(callback) {
    this.github.getAvailableBranches(this, callback);
  }

  toString() {
    return `<Fork name="${this.fullName}">`;
  }

}

export const loadingFork = {
  fullName: "../..",
  user: "..",
  repo: "..",
  defaultBranch: "master",

  availableBranches: function (callback) {
    callback(null, [".."]);
  },

  toString: function () {
    return "<LoadingFork>";
  }
}
