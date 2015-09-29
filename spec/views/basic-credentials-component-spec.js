"use babel";

import BasicCredentialsComponent from '../../lib/views/basic-credentials-component';

import BasicCredentials from '../../lib/models/basic-credentials';

describe("BasicCredentialsComponent", () => {
  let model, component, root;

  beforeEach(() => {
    model = new BasicCredentials({});
    component = new BasicCredentialsComponent({basicCredentials: model});
    root = component.element;
  });

  it("disables the Sign In button before username or password are populated", () => {
    let signInButton = root.querySelector(".btn.sign-in");
    expect(signInButton.hasAttribute("disabled")).toBe(true);
  });

  it("enables the Sign In button once a username and password are typed", () => {
    model.username = "me";
    model.password = "secret";

    waitsForPromise(() => component.revalidate());

    runs(() => {
      let signInButton = root.querySelector(".btn.sign-in");
      expect(signInButton.hasAttribute("disabled")).toBe(false);
    });
  });

  it("displays an error message from the model", () => {
    model.errorMessage = "Oh no";

    waitsForPromise(() => component.revalidate());

    runs(() => {
      expect(root.querySelector(".error-messages li span.msg").innerHTML).toBe("Oh no");
    });
  });

});
