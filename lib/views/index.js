"use babel";

import PullRequestComponent from './pull-request-component';
import BasicCredentialsComponent from './basic-credentials-component';
import TwoFactorCredentialsComponent from './two-factor-credentials-component';

import Repository from '../models/repository';
import BasicCredentials from '../models/basic-credentials';
import TwoFactorCredentials from '../models/two-factor-credentials';

function componentMaker(component) {
  return function(model) {
    return component.fromModel(model).element;
  };
}

export default function registerViews(registry) {
  registry.addViewProvider(Repository, componentMaker(PullRequestComponent));
  registry.addViewProvider(BasicCredentials, componentMaker(BasicCredentialsComponent));
  registry.addViewProvider(TwoFactorCredentials, componentMaker(TwoFactorCredentialsComponent));
}
