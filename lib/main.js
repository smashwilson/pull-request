"use babel";

import {CompositeDisposable} from 'atom';

module.exports = {
  subscriptions: null,

  activate: function(state) {
    this.subs = new CompositeDisposable();

    // Register command that toggles this view
    this.subs.add(atom.commands.add('atom-workspace', {
      'pull-request:open': () => this.open()
    }));
  },

  deactivate: function() {
    this.subs.dispose();
  },

  serialize: function() {
    return {};
  },

  open: function() {
    console.log('PullRequest view opened');

    if (this.modalPanel.isVisible()) {
      this.modalPanel.hide();
    } else {
      this.modalPanel.show();
    }
  }
}
