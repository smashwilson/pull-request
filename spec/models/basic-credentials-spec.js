"use babel";

import BasicCredentials from '../../lib/models/basic-credentials';

describe("BasicCredentials", () => {

  let withInput = (options) => () => {
    let c = new BasicCredentials({
      username: options.username,
      password: options.password
    });

    expect(c.canSignIn()).toBe(options.canSignIn);
  };

  it("doesn't allow empty input", withInput({
    username: "",
    password: "",
    canSignIn: false
  }));

  it("accepts populated inputs", withInput({
    username: "me",
    password: "swordfish",
    canSignIn: true
  }));

  it("invokes a callback on signin", () => {
    let c = new BasicCredentials({
      username: "me",
      password: "swordfish"
    });

    let fired = false;
    c.signInCallback = () => fired = true;

    c.signIn();
    expect(fired).toBe(true);
  });

});
