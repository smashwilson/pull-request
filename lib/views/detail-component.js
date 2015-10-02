"use babel";
/** @jsx etch.dom */

import etch, {getScheduler} from 'etch';
import {CompositeDisposable} from 'atom';

import {State} from '../models/pull-request';
import Mode from '../models/mode';

export default class DetailComponent {

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

    if (this.mode === Mode.EDIT) {
      let titleEditor = this.refs.titleEditor;
      let bodyEditor = this.refs.bodyEditor;
      let cancelButton = this.refs.cancelButton;
      let acceptButton = this.refs.acceptButton;

      this.subs.add(titleEditor.getModel().onDidChange(() => {
        this.titleBuffer = titleEditor.getModel().getText();
      }));

      this.subs.add(bodyEditor.getModel().onDidChange(() => {
        this.bodyBuffer = bodyEditor.getModel().getText();
      }));

      this.subs.add(cancelButton.addEventListener('click', this.handleCancel.bind(this)));
      this.subs.add(acceptButton.addEventListener('click', this.handleAccept.bind(this)));
    } else {
      let editButton = this.refs.editButton;

      this.subs.add(editButton.addEventListener('click', this.handleEdit.bind(this)));
    }
  }

  handleEdit() {
    this.mode = Mode.EDIT;
    this.titleBuffer = this.pullRequest.title;
    this.bodyBuffer = this.pullRequest.body;

    etch.updateElement(this);
    getScheduler().getNextUpdatePromise().then(this.registerListeners.bind(this));
  }

  handleAccept() {
    let attrs = {
      body: this.bodyBuffer,
      title: this.titleBuffer
    };

    this.pullRequest.update(attrs, (err) => {
      if (err) {
        console.error(err);
        return;
      }

      this.mode = Mode.VIEW;
      etch.updateElement(this);
    });
  }

  handleCancel() {
    this.titleBuffer = this.pullRequest.title;
    this.bodyBuffer = this.pullRequest.body;
    this.mode = Mode.VIEW;

    etch.updateElement(this);
    getScheduler().getNextUpdatePromise().then(this.registerListeners.bind(this));
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
        <atom-text-editor className="title" ref="titleEditor" attributes={{mini: true}}>
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
      controls: (
        <div className="controls padded pull-right">
          <button className="btn icon icon-pencil" ref="editButton">Edit</button>
        </div>
      )
    }
  }

}
