"use babel";

import PullRequestComponent from './pull-request-component';

import PullRequest from '../models/pull-request';

function componentMaker(component) {
  return function(model) {
    return component.fromModel(model).element;
  };
}

export default function registerViews(registry) {
  registry.addViewProvider(PullRequest, componentMaker(PullRequestComponent));
}
