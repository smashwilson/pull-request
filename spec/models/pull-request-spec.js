"use babel";

import PullRequest, {State} from '../../lib/models/pull-request';

import Repository from '../../lib/models/repository';
import Fork from '../../lib/models/fork';
import demoTransport from '../../lib/transport/demo';

describe("PullRequest", () => {

  describe("initial state", () => {
    let pr;

    beforeEach(() => {
      let r = new Repository(".", demoTransport);
      pr = new PullRequest(r);
    });

    it("begins in a draft state", () => {
      expect(pr.state).toBe(State.DRAFT);
    });

    it("begins with an empty title and body", () => {
      expect(pr.title).toBe("");
      expect(pr.body).toBe("");
    });

    it("starts without any comments", () => {
      expect(pr.comments.length).toBe(0);
    });

    it("starts without any commits", () => {
      expect(pr.commits.length).toBe(0);
    });
  });

  describe("refreshing", () => {
    let repository, t, pr, hook;

    beforeEach(() => {
      hook = () => {};
      t = demoTransport.make({
        github: {
          getPullRequest: (fork, id, etag, callback) => {
            hook(fork, id);
            callback(null, {
              title: "refreshed title",
              body: "refreshed body",
              state: "open"
            });
          }
        }
      });

      repository = new Repository(".", t);
      pr = new PullRequest(repository);
      pr.state = State.OPEN;
    });

    let isANoOp = (state) => () => {
      pr.state = state;

      let oops = false, done = false;
      hook = () => oops = true;

      pr.refresh((err) => {
        expect(err).toBe(null);
        done = true;
      });

      waitsFor(() => done);

      runs(() => expect(oops).toBe(false));
    }

    it("is a no-op for draft PRs", isANoOp(State.DRAFT));
    it("is a no-op for busy PRs", isANoOp(State.BUSY));

    let usesTheTransport = (state) => () => {
      let fork = new Fork(repository, "username/reponame", "master")

      pr.number = 500;
      pr.state = state;
      pr.baseFork = fork;

      let params, done = false;
      hook = (fork, id) => params = {fork, id};

      pr.refresh((err) => {
        expect(err).toBe(null);
        done = true;
      });

      waitsFor(() => done);

      runs(() => {
        expect(params).not.toBe(null);
        expect(params.fork).toBe(fork);
        expect(params.id).toBe(500);

        expect(pr.title).toBe("refreshed title");
        expect(pr.body).toBe("refreshed body");
      });
    }

    it("uses the transport for open PRs", usesTheTransport(State.OPEN));
    it("uses the transport for closed PRs", usesTheTransport(State.CLOSED));
    it("uses the transport for merged PRs", usesTheTransport(State.MERGED));

  });

  describe("updating", () => {

    let repository, t, pr, hook;

    beforeEach(() => {
      hook = () => {};
      t = demoTransport.make({
        github: {
          updatePullRequest: (fork, number, attrs, etag, callback) => {
            hook(fork, number, attrs);

            attrs.state = attrs.state || "open";

            callback(null, attrs);
          }
        }
      });

      repository = new Repository(".", t);
      pr = new PullRequest(repository);
      pr.body = "original body";
      pr.title = "original title";
    });

    it("applies the changes directly to drafts", () => {
      pr.state = State.DRAFT;

      let hookCalled = false;
      let cbCalled = false;
      hook = () => hookCalled = true;

      pr.update({
        body: "draft body",
        title: "draft title"
      }, (err) => {
        expect(err).toBe(null);
        cbCalled = true;
      });

      expect(pr.body).toBe("draft body");
      expect(pr.title).toBe("draft title");
      expect(cbCalled).toBe(true);
      expect(hookCalled).toBe(false);
    });

    let usesTheTransport = (state) => () => {
      pr.number = 543;
      pr.state = state;

      let hookParams = null;
      let cbCalled = false;
      hook = (fork, number, attrs) => {
        hookParams = {fork, number, attrs};
      };

      pr.update({
        body: "updated body",
        title: "updated title"
      }, (err) => {
        expect(err).toBe(null);
        cbCalled = true;
      });

      waitsFor(() => cbCalled);

      runs(() => {
        expect(hookParams.number).toBe(543);
        expect(hookParams.attrs.body).toBe("updated body");
        expect(hookParams.attrs.title).toBe("updated title");

        expect(pr.body).toBe("updated body");
        expect(pr.title).toBe("updated title");
      });
    };

    it("uses the transport for open PRs", usesTheTransport(State.OPEN));
    it("uses the transport for closed PRs", usesTheTransport(State.CLOSED));
    it("uses the transport for merged PRs", usesTheTransport(State.MERGED));

  });

  describe("submitting", () => {
    it("submits draft PRs", () => {
      let createArguments = null;
      let cbCalled = false;
      let cbErr = null;

      let t = demoTransport.make({
        github: {
          createPullRequest: (fork, msg, callback) => {
            createArguments = {fork, msg};
            callback(null, {
              number: 4321,
              state: "open",
              title: "updated title",
              body: "updated body"
            });
          }
        }
      });

      let r = new Repository(".", t);
      let pr = new PullRequest(r,
        new Fork(r, "base/reponame", "master"), "base-branch",
        new Fork(r, "mine/reponame", "master"), "head-branch");
      pr.title = "original title";
      pr.body = "original body";

      pr.submit((err) => {
        cbErr = err;
        cbCalled = true;
      });

      expect(cbCalled).toBe(true);
      expect(cbErr).toBe(null);
      expect(createArguments.fork.fullName).toBe("base/reponame");
      expect(createArguments.msg.title).toBe("original title");
      expect(createArguments.msg.body).toBe("original body");
      expect(createArguments.msg.base).toBe("base-branch");
      expect(createArguments.msg.head).toBe("mine:head-branch");

      expect(pr.title).toBe("updated title");
      expect(pr.body).toBe("updated body");
      expect(pr.state).toBe(State.OPEN);
    });
  });

  describe("merging", () => {
    it("merges open PRs");
  });

  describe("closing", () => {
    it("closes open PRs", () => {
      let updateArguments = null;
      let called = false;

      let t = demoTransport.make({
        github: {
          updatePullRequest: (fork, number, attrs, etag, callback) => {
            updateArguments = {fork, number, attrs, etag};

            callback(null, {
              number: 100,
              state: "closed",
              title: "updated title",
              body: "updated body",
              meta: {etag: "c3d2e1"}
            });
          }
        }
      });

      let r = new Repository(".", t);
      let pr = new PullRequest(r,
        new Fork(r, "base/reponame", "master"), "base-branch",
        new Fork(r, "mine/reponame", "master"), "head-branch");
      pr.number = 100;
      pr.etag = "1e2d3c";
      pr.title = "original title";
      pr.body = "original body";
      pr.state = State.OPEN;

      pr.close((err) => {
        expect(err).toBe(null);
        called = true;
      });

      expect(called).toBe(true);
      expect(updateArguments.fork.fullName).toBe("base/reponame");
      expect(updateArguments.number).toBe(100);
      expect(updateArguments.attrs.state).toBe("closed");
      expect(updateArguments.attrs.title).toBe("original title");
      expect(updateArguments.attrs.body).toBe("original body");

      expect(pr.state).toBe(State.CLOSED);
      expect(pr.title).toBe("updated title");
      expect(pr.body).toBe("updated body");
      expect(pr.etag).toBe("c3d2e1");
    });
  });

  describe("reopening", () => {
    it("opens closed PRs");
  });

  describe("events", () => {

    it("emits an event when its state changes", () => {
      let r = new Repository(".", demoTransport);
      let pr = new PullRequest(r);

      let updatedTo = null;

      pr.onDidChangeState((state) => updatedTo = state);
      pr.transitionTo(State.OPEN);
      expect(updatedTo).toBe(State.OPEN);
    });

  });

});
