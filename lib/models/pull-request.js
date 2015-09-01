"use babel";

export default class PullRequest {

  constructor() {
    this.title = "";
    this.description = "";

    this.commits = [];
    this.comments = [];
  }

  isDraft() {
    return true;
  }

}
