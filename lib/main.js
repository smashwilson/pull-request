"use babel";

import {CompositeDisposable} from 'atom';
import Repository from './models/repository';
import registerViews from './views';

module.exports = {
  subs: null,
  repository: null,
  pullRequestPanel: null,

  activate: function(state) {
    // Register all views.
    registerViews(atom.views);

    this.subs = new CompositeDisposable();
    this.subs.add(atom.commands.add('atom-workspace', {
      'pull-request:toggle': this.toggle.bind(this)
    }));

    this.repository = new Repository();

    this.pullRequestPanel = atom.workspace.addRightPanel({
      item: this.repository,
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

  toggle: function() {
    if (this.pullRequestPanel.isVisible()) {
      this.pullRequestPanel.hide();
    } else {
      this.pullRequestPanel.show();
    }
  }
}
