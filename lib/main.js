"use babel";

import {CompositeDisposable} from 'atom';
import PullRequest from './models/pull-request';
import registerViews from './views';

module.exports = {
  subs: null,
  pullRequest: null,
  pullRequestPanel: null,

  activate: function(state) {
    // Register all views.
    registerViews(atom.views);

    this.subs = new CompositeDisposable();
    this.subs.add(atom.commands.add('atom-workspace', {
      'pull-request:toggle': this.open.bind(this)
    }));

    this.pullRequest = new PullRequest();

    this.pullRequestPanel = atom.workspace.addRightPanel({
      item: this.pullRequest,
      visible: false
    });
  },

  deactivate: function() {
    this.pullRequestPanel.destroy();
    this.subs.dispose();
  },

  serialize: function() {
    return {};
  },

  open: function() {
    console.log('PullRequest view toggled');

    if (this.pullRequestPanel.isVisible()) {
      this.pullRequestPanel.hide();
    } else {
      this.pullRequestPanel.show();
    }
  }
}
