"use babel";

import ActionComponent from '../../lib/views/action-component';
import PullRequest, {State} from '../../lib/models/pull-request';
import Repository from '../../lib/models/repository';
import demoTransport from '../../lib/transport/demo';

describe("ActionComponent", () => {
  let r, component, root;

  beforeEach(() => {
    r = new Repository(".", demoTransport);
  });

  let withPRState = (state) => {
    let pr = new PullRequest(r);
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
      withPRState(State.DRAFT);

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
});
