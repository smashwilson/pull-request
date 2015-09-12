"use babel";

import Repository from '../../lib/models/repository';

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

});
