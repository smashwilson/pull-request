"use babel";
/** @jsx etch.dom */

import etch from 'etch';

export default class CommitComponent {

  constructor({commit}) {
    this.commit = commit;

    etch.createElement(this);
  }

  render() {
    return (
      <div className="commit block">
        <h2>{this.commit.title} <span className="text-subtle pull-right">{this.commit.sha}</span></h2>
      </div>
    )
  }
}
