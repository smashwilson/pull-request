"use babel";

import Repository from '../../lib/models/repository';
import PullRequest, {State} from '../../lib/models/pull-request';

import demoTransport from '../../lib/transport/demo';

describe("Repository", () => {

  describe("originID", () => {

    it("parses SSH clone URLs", () => {
      let t = demoTransport.make({
        git: {originURL: "git@github.com:username/reponame.git"}
      });

      let r = new Repository(".", t);
      let originID;

      r.originID((err, id) => {
        expect(err).toBe(null);
        originID = id;
      });

      waitsFor(() => originID);

      runs(() => {
        expect(originID).toEqual({
          user: "username",
          repo: "reponame"
        });
      });
    });

    it("parses https clone URLs", () => {
      let t = demoTransport.make({
        git: {originURL: "https://github.com/u/r.git"}
      });

      let r = new Repository(".", t);
      let originID;

      r.originID((err, id) => {
        expect(err).toBe(null);
        originID = id;
      });

      waitsFor(() => originID);

      runs(() => {
        expect(originID).toEqual({
          user: "u",
          repo: "r"
        });
      });
    });

    it("returns an error for non-GitHub clone URLs", () => {
      let t = demoTransport.make({
        git: {originURL: "git@elsewhere.horse/huh.git"}
      });

      let err, r = new Repository(".", t);

      r.originID((e, id) => err = e);

      waitsFor(() => err);

      runs(() => {
        expect(err.message).toBe("git@elsewhere.horse/huh.git doesn't look like a GitHub repository");
      });
    });

  });

  describe("currentPullRequest", () => {

    let existing = {
      number: 123,
      title: "the title",
      body: "the body",
      base: {
        ref: "base-ref",
        repo: {
          full_name: "base-org/reponame",
          default_branch: "base-branch"
        }
      }
    };

    it("finds an existing pull request", () => {
      let t = demoTransport.make({
        git: {
          originURL: "git@github.com:username/reponame.git",
          currentBranch: "some-branch"
        },
        github: {
          currentForkName: "username/reponame",
          sourceForkName: "base-org/base-repo",
          sourcePullRequests: [existing]
        }
      });

      let pr, r = new Repository(".", t);

      r.currentPullRequest((err, result) => pr = result);

      waitsFor(() => pr);

      runs(() => {
        expect(pr.repository).toBe(r);
        expect(pr.title).toBe("the title");
        expect(pr.body).toBe("the body");
        expect(pr.state).toBe(State.OPEN);

        expect(pr.baseFork.github).toBe(t.github);
        expect(pr.baseFork.fullName).toBe("base-org/base-repo");
        expect(pr.baseFork.defaultBranch).toBe("master");
        expect(pr.baseBranch).toBe("base-ref");

        expect(pr.headFork.github).toBe(t.github);
        expect(pr.headFork.fullName).toBe("username/reponame");
        expect(pr.headBranch).toBe("some-branch");
      });
    });

    it("creates a draft pull request");

  });

});
