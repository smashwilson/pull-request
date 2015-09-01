"use babel";
/** @jsx etch.dom */

import etch from 'etch';
import {CompositeDisposable} from 'atom';

export default class SummaryComponent {

  constructor({pullRequest}) {
    this.pullRequest = pullRequest;
    this.subs = new CompositeDisposable();

    etch.createElement(this);

    let titleEditor = this.element.querySelector("atom-text-editor.title").getModel();

    this.subs.add(titleEditor.onDidChange(() => {
      this.pullRequest.title = titleEditor.getText();
    }));

    let descEditor = this.element.querySelector("atom-text-editor.description").getModel();

    this.subs.add(descEditor.onDidChange(() => {
      this.pullRequest.description = descEditor.getText();
    }));
  }

  render() {
    return (
      <div className="summary">
        <div className="block">
          <atom-text-editor className="title" mini>{this.pullRequest.title}</atom-text-editor>
        </div>
        <div className="block">
          <atom-text-editor className="description">{this.pullRequest.description}</atom-text-editor>
        </div>
      </div>
    )
  }

}
