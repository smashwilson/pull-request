"use babel";

import PullRequestComponent from './pull-request-component';

import Repository from '../models/repository';

function componentMaker(component) {
  return function(model) {
    return component.fromModel(model).element;
  };
}

export default function registerViews(registry) {
  registry.addViewProvider(Repository, componentMaker(PullRequestComponent));
}
