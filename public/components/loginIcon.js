import { LitElement, html } from 'lit-element';
import { displayLoginForm } from '../src/eventListener/loginForm';
import { getUserAuth } from '../src/getUserAuth';
import { connect } from 'pwa-helpers';
import { store } from '../src/redux/store';
import { updateUserAuthenticated } from '../src/redux/actions';

class LoginIcon extends connect(store)(LitElement) {
  static get properties() {
    return {
      isUserAuthenticated: { type: Boolean },
    };
  }

  stateChanged(state) {
    this.isUserAuthenticated = state.isUserAuthenticated;
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('open-login-form', displayLoginForm);

    getUserAuth().then((result) =>
      store.dispatch(updateUserAuthenticated(result))
    );
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
