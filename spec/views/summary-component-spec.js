"use babel";

import SummaryComponent from '../../lib/views/summary-component';
import PullRequest from '../../lib/models/pull-request';

describe("SummaryComponent", function () {

  it("populates fields from its model", function () {
    let pullRequest = new PullRequest();
    pullRequest.title = "This is a pull request title";
    pullRequest.description = "This is its description";

    let component = new SummaryComponent({pullRequest});
    let element = component.element;

    let titleEditor = element.querySelector("atom-text-editor.title").getModel();
    expect(titleEditor.getText()).toBe("This is a pull request title");

    let descEditor = element.querySelector("atom-text-editor.description").getModel();
    expect(descEditor.getText()).toBe("This is its description");
  });

  it("updates the model's title", function () {
    let pullRequest = new PullRequest();

    let component = new SummaryComponent({pullRequest});
    let element = component.element;

    let titleEditor = element.querySelector("atom-text-editor.title").getModel();

    titleEditor.setText("This is a new title");

    expect(pullRequest.title).toBe("This is a new title");
  });

});
