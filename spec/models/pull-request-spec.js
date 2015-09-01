"use babel";

import PullRequest from '../../lib/models/pull-request';

describe("PullRequest", function () {

  describe("initial state", function () {
    let pr;

    beforeEach(() => pr = new PullRequest());

    it("begins in a draft state", function () {
      expect(pr.isDraft()).toBe(true);
    });

    it("begins with an empty title and description", function () {
      expect(pr.title).toBe("");
      expect(pr.description).toBe("");
    });

    it("starts without any comments", function () {
      expect(pr.comments.length).toBe(0);
    });

    it("starts without any commits", function () {
      expect(pr.commits.length).toBe(0);
    });
  });

});
