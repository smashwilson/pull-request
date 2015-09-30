"use babel";

import {CompositeDisposable} from 'atom';
import keytar from 'keytar';

import Repository from './models/repository';
import Authorization from './models/authorization';
import transport from './transport';
import registerViews from './views';

const KEYTAR_SERVICE = "Atom GitHub credentials";
const KEYTAR_USERNAME_KEY = "token";

module.exports = {
  subs: null,
  repository: null,
  authorization: null,
  pullRequestPanel: null,

  config: {
    useKeyring: {
      type: 'boolean',
      default: true
    }
  },

  activate: function(state) {
    // Register all views.
    registerViews(atom.views);

    this.transport = transport();

    this.subs = new CompositeDisposable();
    this.subs.add(atom.commands.add('atom-workspace', {
      'pull-request:toggle': this.toggle.bind(this),
      'pull-request:sign-in': this.signIn.bind(this),
      'pull-request:sign-out': this.signOut.bind(this)
    }));

    this.authorization = new Authorization(this.transport);
  },

  deactivate: function() {
    if (this.pullRequestPanel) {
      this.pullRequestPanel.destroy();
    }

    this.subs.dispose();
  },

  serialize: function() {
    return {};
  },

  ensureAuthorization: function (callback) {
    if (this.authorization.isPopulated()) {
      return callback(null, this.authorization);
    }

    // Attempt to locate credentials from the keyring if configured to do so.
    if (atom.config.get("pull-request.useKeyring")) {
      let t = keytar.getPassword(KEYTAR_SERVICE, KEYTAR_USERNAME_KEY);
      if (t) {
        this.authorization.use(t)
        return callback(null, this.authorization);
      }
    }

    // Nope. Trigger the sign-in flow.
    this.signIn(callback);
  },

  toggle: function() {
    if (this.pullRequestPanel) {
      if (this.pullRequestPanel.isVisible()) {
        this.pullRequestPanel.destroy();
      } else {
        this.pullRequestPanel.show();
      }
    } else {
      this.ensureAuthorization((err) => {
        if (err) throw err;

        let gitRepoPath = atom.project.getRepositories()[0].getWorkingDirectory();
        this.repository = new Repository(gitRepoPath, this.transport);

        this.pullRequestPanel = atom.workspace.addRightPanel({item: this.repository});
      });
    }
  },

  signIn: function(callback) {
    if (typeof callback !== "function") {
      callback = null;
    }

    this.authorization.create((err, a) => {
      if (err) {
        if (callback) {
          return callback(err);
        } else {
          throw err;
        }
      }

      // Persist the token in the keyring if configured to do so.
      if (atom.config.get("pull-request.useKeyring")) {
        keytar.replacePassword(KEYTAR_SERVICE, KEYTAR_USERNAME_KEY, a.token);
      }

      if (callback) callback(null, a);
    });
  },

  signOut: function(callback) {
    if (typeof callback !== "function") {
      callback = null;
    }

    if (! this.authorization.isPopulated()) {
      if (callback) callback(null);
      return;
    }

    if (atom.config.get("pull-request.useKeyring")) {
      keytar.deletePassword(KEYTAR_SERVICE, KEYTAR_USERNAME_KEY, this.authorization.token);
    }

    this.authorization.forget();

    atom.notifications.addSuccess("Signed out of GitHub.", {
      detail: "You may wish to delete the personal access token."
    });
  }
}
