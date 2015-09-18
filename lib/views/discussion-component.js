"use babel";
/** @jsx etch.dom */

import etch from 'etch';
import {CompositeDisposable} from 'atom';

import {State} from '../models/pull-request';
import Mode from '../models/mode';

export default class DiscussionComponent {

  constructor({pullRequest}) {
    this.pullRequest = pullRequest;
    this.subs = new CompositeDisposable();

    if (this.pullRequest.state === State.DRAFT) {
      this.mode = Mode.EDIT;
    } else {
      this.mode = Mode.VIEW;
    }

    this.titleBuffer = this.pullRequest.title;
    this.bodyBuffer = this.pullRequest.body;

    etch.createElement(this);
    this.registerListeners();
  }

  registerListeners() {
    this.subs.dispose();

    let titleEditor = this.refs.titleEditor;
    let bodyEditor = this.refs.bodyEditor;

    if (!titleEditor || !bodyEditor) return;

    this.subs.add(titleEditor.getModel().onDidChange(() => {
      this.titleBuffer = titleEditor.getModel().getText();
    }));

    this.subs.add(bodyEditor.getModel().onDidChange(() => {
      this.bodyBuffer = bodyEditor.getModel().getText();
    }));
  }

  handleAccept() {
    etch.updateElement(this);
  }

  handleCancel() {
    etch.updateElement(this);
  }

  render() {
    let elementFunc = this.mode === Mode.VIEW ? this.viewElements.bind(this) : this.editElements.bind(this);
    let {title, body, controls} = elementFunc();

    return (
      <div className="discussion">
        <div className="block">{title}</div>
        <div className="block">{body}</div>
        {controls}
      </div>
    )
  }

  editElements() {
    return {
      title: (
        <atom-text-editor className="title" mini ref="titleEditor">
          {this.pullRequest.title}
        </atom-text-editor>
      ),
      body: (
        <atom-text-editor className="body" ref="bodyEditor">
          {this.pullRequest.body}
        </atom-text-editor>
      ),
      controls: (
        <div className="controls padded pull-right">
          <button className="btn icon icon-circle-slash inline-block-tight" ref="cancelButton">Cancel</button>
          <button className="btn btn-success icon icon-check inline-block-tight" ref="acceptButton">Accept</button>
        </div>
      )
    };
  }

  viewElements() {
    return {
      title: (
        <h2 className="title">{this.pullRequest.title}</h2>
      ),
      body: (
        <p className="body">{this.pullRequest.body}</p>
      ),
      controls: null
    }
  }

}
