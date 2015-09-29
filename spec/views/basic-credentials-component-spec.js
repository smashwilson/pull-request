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
    expect(signInButton.getAttribute("disabled")).toBe("disabled");
  });

  it("enables the Sign In button once a username and password are typed", () => {
    let usernameField = root.querySelector("input.username");
    let passwordField = root.querySelector("input.password");

    usernameField.setAttribute("value", "me");
    passwordField.setAttribute("value", "shhh");

    waitsForPromise(() => component.revalidate());

    runs(() => {
      let signInButton = root.querySelector(".btn.sign-in");
      expect(signInButton.getAttribute("disabled")).not.toBe("disabled");
    });
  });

  it("displays an error message from the model", () => {
    model.errorMessage = "Oh no";

    waitsForPromise(() => component.revalidate());

    runs(() => {
      expect(root.querySelector(".error-messages li").innerHTML).toBe("Oh no");
    });
  });

});
