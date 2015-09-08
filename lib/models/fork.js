"use babel";

export default class Fork {

  constructor(name) {
    this.name = name;
    this.isRoot = false;
  }

  uri() {
    return `git@github.com:${this.name}.git`;
  }

  defaultBranch() {
    return "master";
  }

  availableBranches(callback) {
    callback(null, [this.defaultBranch()]);
  }

  toString() {
    return `<Fork name="${this.name}">`;
  }

}
