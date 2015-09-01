module.exports =
class PullRequestView {
  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('pull-request');

    // Create message element
    var message = document.createElement('div');
    message.textContent = "The PullRequest package is Alive! It's ALIVE!";
    message.classList.add('message');
    this.element.appendChild(message);
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    return this.element.remove();
  }

  getElement() {
    return this.element;
  }
};
