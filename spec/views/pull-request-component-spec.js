"use babel";

import {getScheduler} from 'etch';

import PullRequestComponent from '../../lib/views/pull-request-component';
import Repository from '../../lib/models/repository';
import demoTransport from '../../lib/transport/demo';

describe('PullRequestComponent', () => {
  let repository;
  let component;
  let root;

  beforeEach(() => {
    repository = new Repository(".", demoTransport);
    component = new PullRequestComponent({repository});
    root = component.element;
  });

  it('shows the target component', () => {
    expect(root.querySelector(".target")).toExist();
  });

  it('shows the action component', () => {
    expect(root.querySelector(".action")).toExist();
  });

  it('begins in discussion mode', () => {
    expect(root.querySelector(".discussion")).toExist();
    expect(root.querySelector(".commit-list")).not.toExist();

    expect(root.querySelector(".discussion-tab.selected")).toExist();
    expect(root.querySelector(".commit-list-tab.selected")).not.toExist();
  });

  it('switches to the commit list', () => {
    component.handleCommitList();

    waitsForPromise(() => getScheduler().getNextUpdatePromise());

    runs(() => {
      expect(root.querySelector(".discussion")).not.toExist();
      expect(root.querySelector(".commit-list")).toExist();

      expect(root.querySelector(".discussion-tab.selected")).not.toExist();
      expect(root.querySelector(".commit-list-tab.selected")).toExist();
    });
  });

});
