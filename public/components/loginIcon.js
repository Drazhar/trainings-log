import { LitElement, html } from 'lit-element';
import { displayForm } from '../src/eventListener/openCloseForms';
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
            document.removeEventListener('open-login-form', displayForm);
          } else {
            document.addEventListener('open-login-form', displayForm);
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
            <div
              style="border-radius: 50%; background-color: RGBA(255,255,255,0.4); width: 1.5em; height: 1.5em; display: flex; align-items: center; justify-content: center;"
            >
              :)
            </div>
          </div>`}
    `;
  }

  createRenderRoot() {
    return this;
  }
}

customElements.define('login-icon', LoginIcon);
