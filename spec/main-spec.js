"use babel";

import PullRequest from '../lib/main';

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

describe("PullRequest", function() {
  var [workspaceElement, activationPromise] = [];

  beforeEach(function() {
    workspaceElement = atom.views.getView(atom.workspace);
    return activationPromise = atom.packages.activatePackage('pull-request');
  });

  describe("when the pull-request:toggle event is triggered", function() {
    it("hides and shows the modal panel", function() {
      // Before the activation event the view is not on the DOM, and no panel
      // has been created
      expect(workspaceElement.querySelector('.pull-request')).not.toExist();

      // This is an activation event, triggering it will cause the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'pull-request:toggle');

      waitsForPromise(function() {
        return activationPromise;
      });

      return runs(function() {
        expect(workspaceElement.querySelector('.pull-request')).toExist();

        var pullRequestElement = workspaceElement.querySelector('.pull-request');
        expect(pullRequestElement).toExist();

        var pullRequestPanel = atom.workspace.panelForItem(pullRequestElement);
        expect(pullRequestPanel.isVisible()).toBe(true);
        atom.commands.dispatch(workspaceElement, 'pull-request:toggle');
        return expect(pullRequestPanel.isVisible()).toBe(false);
      });
    });

    return it("hides and shows the view", function() {
      // This test shows you an integration test testing at the view level.

      // Attaching the workspaceElement to the DOM is required to allow the
      // `toBeVisible()` matchers to work. Anything testing visibility or focus
      // requires that the workspaceElement is on the DOM. Tests that attach the
      // workspaceElement to the DOM are generally slower than those off DOM.
      jasmine.attachToDOM(workspaceElement);

      expect(workspaceElement.querySelector('.pull-request')).not.toExist();

      // This is an activation event, triggering it causes the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'pull-request:toggle');

      waitsForPromise(function() {
        return activationPromise;
      });

      runs(function() {
        // Now we can test for view visibility
        var pullRequestElement = workspaceElement.querySelector('.pull-request');
        expect(pullRequestElement).toBeVisible();
        atom.commands.dispatch(workspaceElement, 'pull-request:toggle');
        return expect(pullRequestElement).not.toBeVisible();
      });
    });
  });
});
