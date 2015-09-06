"use babel";

export default class Commit {

  constructor () {
    this.sha = "";
    this.title = "";
    this.description = "";
    this.pushed = false;
  }

  sha() {
    return this.sha;
  }

}
