"use babel";

export default function () {
  if (atom.inSpecMode() || process.env.PR_DEMO_MODE) {
    import demo from './demo';
    return demo;
  } else {
    import live from './live';
    return live;
  }
};
