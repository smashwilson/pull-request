"use babel";

import live from '../lib/transport/live';
import demo from '../lib/transport/demo';

describe("transport consistency", () => {

  let toMatchDemo = function (name, expected) {
    this.message = () => this._message;

    if (expected === undefined) {
      this._message = `${name} is missing from the demo transport`;
      return false;
    }

    if (typeof this.actual !== typeof expected) {
      this._message = `Live ${name} has type ${typeof this.actual}, but demo has type ${typeof expected}`;
      return false;
    }

    if (typeof this.actual === "function" && this.actual.length !== expected.length) {
      this._message = `Live ${name} accepts ${this.actual.length} parameters, but demo accepts ${expected.length}`;
      return false;
    }

    return true;
  };

  let toNotBeThere = function (name) {
    this.message = () => `Demo has a method ${name} that is not present on live transport.`;
    return false;
  };

  beforeEach(function () {
    this.addMatchers({toMatchDemo, toNotBeThere});
  });

  let isConsistent = (prop) => () => {
    let liveObject = live[prop];
    let demoObject = demo[prop];
    let seen = {};

    Object.keys(liveObject).forEach((k) => {
      let liveVersion = liveObject[k];
      let demoVersion = demoObject[k];

      expect(liveVersion).toMatchDemo(k, demoVersion);
      seen[k] = true;
    });

    Object.keys(demoObject).forEach((k) => {
      if (seen[k]) return;
      if (k.startsWith("_")) return;

      let demoVersion = demoObject[k];
      if (typeof demoVersion !== "function") return;

      expect(demoVersion).toNotBeThere(k);
    });
  };

  it("has the same methods and properties for git", isConsistent("git"));
  it("has the same methods and properties for github", isConsistent("github"));

});
