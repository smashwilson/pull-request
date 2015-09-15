"use babel";

import TargetComponent from '../../lib/views/target-component';

import Repository from '../../lib/models/repository';
import Fork from '../../lib/models/fork';
import PullRequest from '../../lib/models/pull-request';

import demoTransport from '../../lib/transport/demo';

describe("TargetComponent", function () {
  let component, root;
  let repository, baseFork, headFork, pullRequest;

  beforeEach(function () {
    repository = new Repository(".", demoTransport);

    baseFork = new Fork(repository, "base/repo", "master");
    headFork = new Fork(repository, "head/repo", "master");

    pullRequest = new PullRequest(repository, baseFork, "base-branch", headFork, "head-branch");

    component = new TargetComponent({pullRequest});
    root = component.element;
  });

  it("shows the base fork and branch", function () {
    expect(root.querySelector("span.base").innerHTML).toEqual("base:base-branch");
  });

  it("shows the head fork and branch", function () {
    expect(root.querySelector("span.head").innerHTML).toEqual("head:head-branch");
  });

});
