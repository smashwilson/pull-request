"use babel";

import Repository from '../../lib/models/repository';

import demoTransport from '../../lib/transport/demo';

fdescribe("Repository", () => {

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
      })
    });

    it("parses https clone URLs");

    it("returns an error for non-GitHub clone URLs");

  });

});
