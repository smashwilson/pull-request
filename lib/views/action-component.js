"use babel";
/** @jsx etch.dom */

import etch from 'etch';
import {CompositeDisposable} from 'atom';

export default class ActionComponent {

  constructor({pullRequest}) {
    this.subs = new CompositeDisposable();
    this.pullRequest = pullRequest;

    etch.createElement(this);

    this.subs.add(this.pullRequest.onDidChangeState(() => {
      etch.updateElement(this);
    }));
  }

  destroy() {
    this.subs.dispose();
  }

  render() {
    return this.pullRequest.state.when({
      draft: this.renderDraft.bind(this),
      open: this.renderOpen.bind(this),
      closed: this.renderClosed.bind(this),
      merged: this.renderMerged.bind(this),
      busy: this.renderBusy.bind(this)
    });
  }

  renderDraft() {
    return (
      <div className="action padded">
        <div className="controls pull-right">
          <button className="btn btn-success" ref="createButton">Create</button>
        </div>
      </div>
    );
  }

  renderOpen() {
    return (
      <div className="action padded">
        <div className="controls pull-right">
          <button className="btn" ref="closeButton">Close</button>
          <button className="btn btn-success" ref="mergeButton">Merge</button>
        </div>
      </div>
    );
  }

  renderClosed() {
    return (
      <div className="action padded">
        <div className="controls pull-right">
          <button className="btn" ref="closeButton">Reopen</button>
        </div>
      </div>
    )
  }

  renderMerged() {
    return (
      <div className="action padded">
        <p className="explanation">This pull request has already been merged.</p>
      </div>
    )
  }

  renderBusy() {
    return (
      <div className="action padded">
        <span className='loading loading-spinner-medium inline-block'></span>
      </div>
    );
  }
}
