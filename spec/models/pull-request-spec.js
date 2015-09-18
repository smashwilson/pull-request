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
          getPullRequest: (fork, id, callback) => {
            hook(fork, id);
            callback(null, {
              title: "refreshed title",
              body: "refreshed body"
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

  })

});
