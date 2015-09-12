"use babel";

import github from './github';
import git from './git';

export default {
  github,
  git,

  make: function ({git, github}) {
    let dup = Object.create(this);

    if (git) {
      let g = Object.create(this.git);

      Object.keys(git).forEach((k) => {
        g[k] = git[k];
      });

      dup.git = g;
    } else {
      dup.git = this.git;
    }

    if (github) {
      let gh = Object.create(this.github);

      Object.keys(github).forEach((k) => {
        gh[k] = github[k];
      });

      dup.github = gh;
    } else {
      dup.github = this.github;
    }

    return dup;
  }
};
