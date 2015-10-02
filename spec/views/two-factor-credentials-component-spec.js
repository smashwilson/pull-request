"use babel";

import etch from 'etch';
import TwoFactorCredentialsComponent from '../../lib/views/two-factor-credentials-component';
import TwoFactorCredentials from '../../lib/models/two-factor-credentials';

describe("TwoFactorCredentialsComponent", () => {
  let model, component, root;

  beforeEach(() => {
    model = new TwoFactorCredentials({});
    component = new TwoFactorCredentialsComponent({twoFactorCredentials: model});
    root = component.element;
  });

  it("disables the Verify button with no input", () => {
    let verifyButton = root.querySelector(".btn.verify");
    expect(verifyButton.hasAttribute("disabled")).toBe(true);
  });

  it("displays an error when validation fails", () => {
    model.code = "abc";

    waitsForPromise(() => etch.updateElement(component));

    runs(() => {
      let message = "Please specify a six-digit code.";
      expect(root.querySelector(".error-messages li span.msg").innerHTML).toBe(message);
    });
  });

  it("enables the Verify button when a valid code is provided", () => {
    model.code = "123456";

    waitsForPromise(() => etch.updateElement(component));

    runs(() => {
      let verifyButton = root.querySelector(".btn.verify");
      expect(verifyButton.hasAttribute("disabled")).toBe(false);
    });
  });

  it("displays an error when one is present on the model", () => {
    model.errorMessage = "Argh";

    waitsForPromise(() => etch.updateElement(component));

    runs(() => {
      expect(root.querySelector(".error-messages li span.msg").innerHTML).toBe("Argh");
    });
  });

});
