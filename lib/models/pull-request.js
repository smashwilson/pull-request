"use babel";

export var State = {
  DRAFT: "DRAFT",
  OPEN: "OPEN",
  CLOSED: "CLOSED",
  MERGED: "MERGED"
};

export default class PullRequest {

  constructor() {
    this.title = "";
    this.description = "";

    this.state = State.DRAFT;

    this.commits = [];
    this.comments = [];
  }

  toString() {
    return `<PullRequest title="${this.title}" state="${this.state}">`
  }

}
