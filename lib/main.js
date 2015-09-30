"use babel";

import {CompositeDisposable} from 'atom';
import Repository from './models/repository';
import Authorization from './models/authorization';
import transport from './transport';
import registerViews from './views';

module.exports = {
  subs: null,
  repository: null,
  pullRequestPanel: null,

  activate: function(state) {
    // Register all views.
    registerViews(atom.views);

    this.transport = transport();

    this.subs = new CompositeDisposable();
    this.subs.add(atom.commands.add('atom-workspace', {
      'pull-request:toggle': this.toggle.bind(this),
      'pull-request:sign-in': this.signIn.bind(this)
    }));

    let gitRepoPath = atom.project.getRepositories()[0].getWorkingDirectory();
    this.repository = new Repository(gitRepoPath, this.transport);

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
  },

  signIn: function() {
    let a = new Authorization(this.transport);
    a.create(() => {
      console.log(`Authorization completed: ${a.token}`)
    });
  }
}
