var PullRequest;
var PullRequestView = require('./pull-request-view');
var {CompositeDisposable} = require('atom');

module.exports = {
  pullRequestView: null,
  modalPanel: null,
  subscriptions: null,

  activate: function(state) {
    this.pullRequestView = new PullRequestView(state.pullRequestViewState);
    this.modalPanel = atom.workspace.addModalPanel({item: this.pullRequestView.getElement(), visible: false});

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    return this.subscriptions.add(atom.commands.add('atom-workspace', 'pull-request:toggle': () => this.toggle()}));
  },

  deactivate: function() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    return this.pullRequestView.destroy();
  },

  serialize: function() {
    return {pullRequestViewState: this.pullRequestView.serialize()};
  },

  toggle: function() {
    console.log('PullRequest was toggled!');

    if (this.modalPanel.isVisible()) {
      return this.modalPanel.hide();
    } else {
      return this.modalPanel.show();
    }
  };
}
