"use babel";

export default class Fork {

  constructor(repository, name, defaultBranch) {
    this.github = repository.transport.github;

    this.name = name;
    this.defaultBranch = defaultBranch;

    this.isRoot = false;
  }

  uri() {
    return `git@github.com:${this.name}.git`;
  }

  availableBranches(callback) {
    this.github.getAvailableBranches(this, callback);
  }

  toString() {
    return `<Fork name="${this.name}">`;
  }

}

export const loadingFork = {
  name: "..",
  defaultBranch: "master",
  isRoot: false,

  availableBranches: function (callback) {
    callback(null, [".."]);
  },

  toString: function () {
    return "<LoadingFork>";
  }
}
