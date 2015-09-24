"use babel";

import {getScheduler} from 'etch';

import ActionComponent from '../../lib/views/action-component';
import PullRequest, {State} from '../../lib/models/pull-request';
import Repository from '../../lib/models/repository';
import demoTransport from '../../lib/transport/demo';

describe("ActionComponent", () => {
  let r, pr, component, root;

  beforeEach(() => {
    r = new Repository(".", demoTransport);
  });

  let withPRState = (state) => {
    pr = new PullRequest(r);
    pr.state = state;

    component = new ActionComponent({pullRequest: pr});
    root = component.element;
  }

  describe("button visibility", () => {
    it("shows a spinner while busy", () => {
      withPRState(State.BUSY);

      expect(root.querySelector(".loading")).not.toBe(null);
    });

    it("shows a create button in DRAFT", () => {
      withPRState(State.DRAFT);

      expect(component.refs.createButton).not.toBe(null);
      let button = root.querySelector(".btn");
      expect(button.innerHTML).toBe("Create");
    });

    it("shows close and merge buttons in OPEN", () => {
      withPRState(State.OPEN);

      expect(component.refs.closeButton).not.toBe(null);
      let buttons = Array.prototype.slice.call(root.querySelectorAll(".btn"));
      let buttonsText = buttons.map((e) => e.innerHTML);

      expect(buttonsText.indexOf("Close")).not.toBe(-1);
      expect(buttonsText.indexOf("Merge")).not.toBe(-1);
    });

    it("shows a reopen button in CLOSED", () => {
      withPRState(State.CLOSED);

      expect(component.refs.reopenButton).not.toBe(null);
      let button = root.querySelector(".btn");
      expect(button.innerHTML).toBe("Reopen");
    });
  });

  describe("state tracking", () => {
    it("updates to match the current PR state", () => {
      withPRState(State.DRAFT);
      let promise = getScheduler().getNextUpdatePromise();

      pr.transitionTo(State.OPEN);

      waitsForPromise(() => promise);

      runs(() => {
        expect(root.querySelector(".btn-success").innerHTML).toBe("Merge");
      });
    });
  });
});
