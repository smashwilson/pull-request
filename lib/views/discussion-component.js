"use babel";
/** @jsx etch.dom */

import etch from 'etch';
import {CompositeDisposable} from 'atom';

export default class DiscussionComponent {

  constructor({pullRequest}) {
    this.pullRequest = pullRequest;
    this.subs = new CompositeDisposable();

    etch.createElement(this);

    let titleEditor = this.refs.titleEditor.getModel();

    this.subs.add(titleEditor.onDidChange(() => {
      this.pullRequest.title = titleEditor.getText();
    }));

    let bodyEditor = this.refs.bodyEditor.getModel();

    this.subs.add(bodyEditor.onDidChange(() => {
      this.pullRequest.description = descEditor.getText();
    }));
  }

  render() {
    return (
      <div className="discussion">
        <div className="block">
          <atom-text-editor className="title" mini ref="titleEditor">
            {this.pullRequest.title}
          </atom-text-editor>
        </div>
        <div className="block">
          <atom-text-editor className="body" ref="bodyEditor">
            {this.pullRequest.body}
          </atom-text-editor>
        </div>
      </div>
    )
  }

}
