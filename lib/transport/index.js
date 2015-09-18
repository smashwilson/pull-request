"use babel";

export default function () {
  if (atom.inSpecMode() || process.env.PR_DEMO_MODE) {
    return require('./demo');
  } else {
    return require('./live');
  }
};
