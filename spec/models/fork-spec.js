"use babel";

import Fork from '../../lib/models/fork';

import Repository from '../../lib/models/repository';
import demoTransport from '../../lib/transport/demo';

describe("Fork", () => {

  let r = new Repository(".", demoTransport);

  it("parses user/repo from its name", () => {
    let f = new Fork(r, "user/repo", "master");

    expect(f.github).toBe(demoTransport.github);
    expect(f.user).toBe("user");
    expect(f.repo).toBe("repo");
    expect(f.fullName).toBe("user/repo");
    expect(f.defaultBranch).toBe("master");
  });

  it("falls back to assuming name/name", () => {
    let f = new Fork(r, "nope", "devel");

    expect(f.user).toBe("nope");
    expect(f.repo).toBe("nope");
    expect(f.fullName).toBe("nope/nope");
  })

});
