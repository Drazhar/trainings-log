import { LitElement, html } from 'lit-element';
import { displayLoginForm } from '../src/eventListener/loginForm';
import { getUserAuth } from '../src/getUserAuth';
import { connect } from 'pwa-helpers';
import { store } from '../src/redux/store';
import { updateUserAuthenticated } from '../src/redux/actions';

class LoginIcon extends connect(store)(LitElement) {
  static get properties() {
    return {
      isUserAuthenticated: {
        type: Boolean,
        hasChanged(newVal, oldVal) {
          if (newVal === true) {
            document.removeEventListener('open-login-form', displayLoginForm);
          } else {
            document.addEventListener('open-login-form', displayLoginForm);
          }
          if (newVal !== oldVal) {
            return true;
          }
        },
      },
      userID: { type: String },
    };
  }

  stateChanged(state) {
    this.isUserAuthenticated = state.isUserAuthenticated;
    this.userID = state.userID;
  }

  connectedCallback() {
    super.connectedCallback();

    getUserAuth().then((result) =>
      store.dispatch(updateUserAuthenticated(result))
    );
  }

  _handleLoginButton() {
    document.dispatchEvent(new CustomEvent('open-login-form', {}));
  }

  render() {
    return html`
      ${!this.isUserAuthenticated
        ? html`<button
            class="outlined-button"
            @click="${this._handleLoginButton}"
          >
            <span>Login</span>
          </button>`
        : html`<div class="avatar-icon">
            <img
              src="https://api.adorable.io/avatars/40/${this.userID}.png"
              alt="user icon"
            />
          </div>`}
    `;
  }

  createRenderRoot() {
    return this;
  }
}

customElements.define('login-icon', LoginIcon);
