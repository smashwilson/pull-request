"use babel";

import PullRequest, {State} from '../../lib/models/pull-request';

import Repository from '../../lib/models/repository';
import demoTransport from '../../lib/transport/demo';

describe("PullRequest", () => {

  describe("initial state", () => {
    let pr;

    beforeEach(() => pr = new PullRequest());

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
    let t, pr, hook;

    beforeEach(() => {
      hook = () => {};
      t = demoTransport.make({
        github: {
          getPullRequest: (id, callback) => {
            hook(id);
            callback(null, {
              title: "refreshed title",
              body: "refreshed body",
            });
          }
        }
      });

      let r = new Repository(".", t);
      pr = new PullRequest(r);
      pr.state = State.OPEN;
    });

    it("is a no-op for draft PRs", () => {
      pr.state = State.DRAFT;

      let oops = false, done = false;
      hook = () => oops = true;

      pr.refresh((err) => {
        expect(err).toBe(null);
        done = true;
      });

      waitsFor(() => done);

      runs(() => expect(oops).toBe(false));
    });

  })

});
