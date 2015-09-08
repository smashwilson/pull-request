"use babel";
/** @jsx etch.dom */

import etch from 'etch';
import CommitComponent from './commit-component';

export default class CommitListComponent {

  constructor({pullRequest}) {
    this.pullRequest = pullRequest;

    etch.createElement(this);
  }

  render() {
    let items = this.pullRequest.commits.map((commit) => {
      return (
        <li className="list-item">
          <CommitComponent key={commit.id} commit={commit}/>
        </li>
      );
    });

    return (
      <div className="commit-list select-list">
        <ol className="list-group">{items}</ol>
      </div>
    )
  }
}
