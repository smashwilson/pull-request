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
      <div className="commit">
      </div>
    )
  }
}
