"use babel";

var nextID = 0;

export default class Commit {

  constructor (sha, title, description) {
    this.id = nextID++;
    this.sha = sha;
    this.title = title;
    this.description = description;

    this.pushed = false;
  }

  sha() {
    return this.sha;
  }

}
