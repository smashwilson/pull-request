"use babel";

import TwoFactorCredentials from '../../lib/models/two-factor-credentials';

describe("TwoFactorCredentials", () => {

  let withInput = (options) => () => {
    let c = new TwoFactorCredentials({
      code: options.code
    });

    expect(c.isValid()).toBe(options.isValid);
    expect(c.canVerify()).toBe(options.canVerify);
  };

  it("doesn't allow empty input", withInput({
    code: "",
    isValid: true,
    canVerify: false
  }));

  it("doesn't accept non-numeric input", withInput({
    code: "123a",
    isValid: false,
    canVerify: false
  }));

  it("doesn't permit signin with less than six digits", withInput({
    code: "123",
    isValid: true,
    canVerify: false
  }));

  it("accepts a six-digit numeric code", withInput({
    code: "123456",
    isValid: true,
    canVerify: true
  }));

  it("invokes a callback on verify", () => {
    let c = new TwoFactorCredentials({
      code: "123456"
    });

    let fired = false;
    c.verifyCallback = () => fired = true;

    c.verify();
    expect(fired).toBe(true);
  });

});
