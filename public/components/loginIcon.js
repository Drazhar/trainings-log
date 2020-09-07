import { LitElement, html } from 'lit-element';

class LoginIcon extends LitElement {
  _handleLoginButton() {
    this.dispatchEvent(new CustomEvent('open-login-form', {}));
  }

  render() {
    return html`
      <button class="outlined-button" @click="${this._handleLoginButton}">
        <span>Login</span>
      </button>
    `;
  }

  createRenderRoot() {
    return this;
  }
}

customElements.define('login-icon', LoginIcon);
