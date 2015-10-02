"use babel";

import github from './github';
import git from './git';

function validStub(name, real, stub) {
  if (real === undefined) {
    throw new Error(`Attempt to stub nonexistent property: ${name}`);
  }

  if (typeof real !== typeof stub) {
    throw new Error(`Attempt to stub ${name} (${typeof real}) with ${typeof stub}`);
  }

  if (typeof real === 'function' && real.length !== stub.length) {
    throw new Error(`Argument length mismatch for ${name}: ${real.length} expected, got ${stub.length}`);
  }
}

export default {
  github,
  git,

  make: function ({git, github}) {
    let dup = Object.create(this);

    if (git) {
      let g = Object.create(this.git);

      Object.keys(git).forEach((k) => {
        validStub(k, this.git[k], git[k]);

        g[k] = git[k];
      });

      dup.git = g;
    }

    if (github) {
      let gh = Object.create(this.github);

      Object.keys(github).forEach((k) => {
        validStub(k, this.github[k], github[k]);

        gh[k] = github[k];
      });

      dup.github = gh;
    }

    return dup;
  }
};
