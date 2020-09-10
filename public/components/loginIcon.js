import { LitElement, html } from 'lit-element';
import { displayLoginForm } from '../src/eventListener/loginForm';

class LoginIcon extends LitElement {
  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('open-login-form', displayLoginForm);
  }

  _handleLoginButton() {
    document.dispatchEvent(new CustomEvent('open-login-form', {}));
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
