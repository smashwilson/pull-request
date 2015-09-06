"use babel";

import package from '../lib/main';

describe("package entry point", function() {
  var [workspaceElement, activationPromise] = [];

  beforeEach(function() {
    workspaceElement = atom.views.getView(atom.workspace);
    activationPromise = atom.packages.activatePackage('pull-request');
  });

  describe("when the pull-request:toggle event is triggered", function() {
    it("hides and shows the pull request panel", function() {
      expect(workspaceElement.querySelector('.pull-request')).not.toExist();
      atom.commands.dispatch(workspaceElement, 'pull-request:toggle');

      waitsForPromise(() => activationPromise);

      runs(() => {
        expect(workspaceElement.querySelector('.pull-request')).toExist();

        let pullRequestPanel = package.pullRequestPanel;

        expect(pullRequestPanel.isVisible()).toBe(true);
        atom.commands.dispatch(workspaceElement, 'pull-request:toggle');
        expect(pullRequestPanel.isVisible()).toBe(false);
      });
    });

    // it("hides and shows the view", function() {
    //   // This test shows you an integration test testing at the view level.
    //
    //   // Attaching the workspaceElement to the DOM is required to allow the
    //   // `toBeVisible()` matchers to work. Anything testing visibility or focus
    //   // requires that the workspaceElement is on the DOM. Tests that attach the
    //   // workspaceElement to the DOM are generally slower than those off DOM.
    //   jasmine.attachToDOM(workspaceElement);
    //
    //   expect(workspaceElement.querySelector('.pull-request')).not.toExist();
    //
    //   // This is an activation event, triggering it causes the package to be
    //   // activated.
    //   atom.commands.dispatch(workspaceElement, 'pull-request:toggle');
    //
    //   waitsForPromise(function() {
    //     return activationPromise;
    //   });
    //
    //   runs(function() {
    //     // Now we can test for view visibility
    //     var pullRequestElement = workspaceElement.querySelector('.pull-request');
    //     expect(pullRequestElement).toBeVisible();
    //     atom.commands.dispatch(workspaceElement, 'pull-request:toggle');
    //     return expect(pullRequestElement).not.toBeVisible();
    //   });
    // });
  });
});
