"use babel";
/** @jsx etch.dom */

import etch from 'etch';

export default class CommentComponent {

  constructor({comment}) {
    this.comment = comment;

    etch.createElement(this);
  }

  render() {
    return (
      <div className="comment">
      </div>
    )
  }
}
