"use babel";
/** @jsx etch.dom */

import etch from 'etch';
import DomListener from 'dom-listener';
import {CompositeDisposable} from 'atom';

export default class ActionComponent {

  constructor({pullRequest}) {
    this.subs = new CompositeDisposable();

    this.pullRequest = pullRequest;

    etch.createElement(this);

    this.listener = new DomListener(this.element);
    this.subs.add(this.listener.add('.btn.create-btn', 'click', this.handleCreate.bind(this)));
    this.subs.add(this.listener.add('.btn.close-btn', 'click', this.handleClose.bind(this)));
    this.subs.add(this.listener.add('.btn.merge-btn', 'click', this.handleMerge.bind(this)));
    this.subs.add(this.listener.add('.btn.reopen-btn', 'click', this.handleReopen.bind(this)));
  }

  handleCreate() {
    this.pullRequest.submit(this.errHandler.bind(this));
  }

  handleClose() {
    this.pullRequest.close(this.errHandler.bind(this));
  }

  handleMerge() {
    this.pullRequest.merge(this.errHandler.bind(this));
  }

  handleReopen() {
    this.pullRequest.reopen(this.errHandler.bind(this));
  }

  errHandler(err) {
    if (err) {
      throw err;
    }

    return etch.updateElement(this);
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
          <button className="create-btn btn btn-success inline-block">Create</button>
        </div>
        <div className="clear" />
      </div>
    );
  }

  renderOpen() {
    return (
      <div className="action padded inset-panel">
        <div className="controls pull-right">
          <button className="close-btn btn inline-block">Close</button>
          <button className="merge-btn btn btn-success inline-block">Merge</button>
        </div>
        <div className="clear" />
      </div>
    );
  }

  renderClosed() {
    return (
      <div className="action padded inset-panel">
        <div className="controls pull-right">
          <button className="reopen-btn btn inline-block" ref="reopenButton">Reopen</button>
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
        <span className='loading loading-spinner-small inline-block'></span>
      </div>
    );
  }
}
