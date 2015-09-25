"use babel";
/** @jsx etch.dom */

import etch from 'etch';
import {CompositeDisposable} from 'atom';

export default class ActionComponent {

  constructor({pullRequest}) {
    this.pullRequest = pullRequest;

    etch.createElement(this);
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
      <div className="action padded inset-panel">
        <div className="controls pull-right">
          <button className="btn btn-success inline-block" ref="createButton">Create</button>
        </div>
        <div className="clear" />
      </div>
    );
  }

  renderOpen() {
    return (
      <div className="action padded inset-panel">
        <div className="controls pull-right">
          <button className="btn inline-block" ref="closeButton">Close</button>
          <button className="btn btn-success inline-block" ref="mergeButton">Merge</button>
        </div>
        <div className="clear" />
      </div>
    );
  }

  renderClosed() {
    return (
      <div className="action padded inset-panel">
        <div className="controls pull-right">
          <button className="btn inline-block" ref="reopenButton">Reopen</button>
        </div>
        <div className="clear" />
      </div>
    )
  }

  renderMerged() {
    return (
      <div className="action padded inset-panel">
        <p className="explanation">This pull request has already been merged.</p>
      </div>
    )
  }

  renderBusy() {
    return (
      <div className="action padded inset-panel">
        <span className='loading loading-spinner-medium inline-block'></span>
      </div>
    );
  }
}
