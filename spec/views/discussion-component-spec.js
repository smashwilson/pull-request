"use babel";

import {getScheduler} from 'etch';

import DiscussionComponent from '../../lib/views/discussion-component';
import PullRequest, {State} from '../../lib/models/pull-request';
import Repository from '../../lib/models/repository';
import Mode from '../../lib/models/mode';

import demoTransport from '../../lib/transport/demo';

describe("DiscussionComponent", () => {
  let r;

  beforeEach(() => {
    r = new Repository(".", demoTransport);
  });

  describe("mode", () => {

    it("begins in edit mode with a draft", () => {
      let pullRequest = new PullRequest(r);
      pullRequest.state = State.DRAFT;

      let component = new DiscussionComponent({pullRequest});
      expect(component.mode).toBe(Mode.EDIT);
    });

    it("begins in view mode when open", () => {
      let pullRequest = new PullRequest(r);
      pullRequest.state = State.OPEN;

      let component = new DiscussionComponent({pullRequest});
      expect(component.mode).toBe(Mode.VIEW);
    });

  });

  describe("in view mode", () => {
    let pullRequest, component, element;

    beforeEach(() => {
      pullRequest = new PullRequest(r);
      pullRequest.title = "This is an open pull request";
      pullRequest.body = "This is its body";
      pullRequest.state = State.OPEN;

      component = new DiscussionComponent({pullRequest});

      element = component.element;
    });

    it("shows the current title and body", () => {
      let titleElement = element.querySelector(".title");
      expect(titleElement.innerHTML).toBe("This is an open pull request");

      let bodyElement = element.querySelector(".body");
      expect(bodyElement.innerHTML).toBe("This is its body");
    });

  });

  describe("in edit mode", () => {
    let pullRequest, component, element;

    beforeEach(() => {
      pullRequest = new PullRequest(r);
      pullRequest.title = "This is a pull request title";
      pullRequest.body = "This is its body";
      pullRequest.state = State.DRAFT;

      component = new DiscussionComponent({pullRequest});

      element = component.element;
    });

    it("populates editors from its model", () => {
      let titleEditor = element.querySelector("atom-text-editor.title").getModel();
      expect(titleEditor.getText()).toBe("This is a pull request title");

      let descEditor = element.querySelector("atom-text-editor.body").getModel();
      expect(descEditor.getText()).toBe("This is its body");
    });

    it("shows accept and cancel buttons", () => {
      let acceptButton = element.querySelector("button.btn-success");
      expect(acceptButton).not.toBe(null);

      let cancelButton = element.querySelector("button.icon-circle-slash");
      expect(cancelButton).not.toBe(null);
    });

    it("updates the buffered title", () => {
      let titleEditor = element.querySelector("atom-text-editor.title").getModel();
      titleEditor.setText("This is a new title");

      expect(component.titleBuffer).toBe("This is a new title");
      expect(pullRequest.title).toBe("This is a pull request title");
    });

    it("updates the buffered body", () => {
      let bodyEditor = element.querySelector("atom-text-editor.body").getModel();
      bodyEditor.setText("This is a new body");

      expect(component.bodyBuffer).toBe("This is a new body");
      expect(pullRequest.body).toBe("This is its body");
    });

    it("applies changes on accept", () => {
      component.refs.bodyEditor.getModel().setText("This is a new body");
      component.refs.titleEditor.getModel().setText("This is a new title");

      component.handleAccept();

      waitsForPromise(() => getScheduler().getNextUpdatePromise());

      runs(() => {
        expect(component.mode).toBe(Mode.VIEW);
        expect(pullRequest.body).toBe("This is a new body");
        expect(pullRequest.title).toBe("This is a new title");
      });
    })

  });

});
