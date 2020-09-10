import { LitElement, html } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { connect } from 'pwa-helpers';
import { store } from '../src/redux/store';
import { updateUserAuthenticated } from '../src/redux/actions';

class LoginForm extends connect(store)(LitElement) {
  static get properties() {
    return {
      mode: { type: String },
    };
  }

  constructor() {
    super();
    this.mode = 'login';
    this.loginClasses = { active: true, inactive: false };
    this.registerClasses = { active: false, inactive: true };
  }

  _handleLogin(e) {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const data = {
      email,
      password,
    };
    fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.success === true) {
          store.dispatch(
            updateUserAuthenticated({ isUserAuth: true, email: email })
          );
          document.dispatchEvent(new CustomEvent('close-login-form', {}));
        }
      });
  }

  _handleRegister(e) {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const data = {
      email,
      password,
    };
    fetch('http://localhost:3000/api/addUser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.success === true) {
          store.dispatch(
            updateUserAuthenticated({ isUserAuth: true, email: email })
          );
          document.dispatchEvent(new CustomEvent('close-login-form', {}));
        }
      });
  }

  _closeLoginForm(e) {
    if (document.getElementById('login-container') == e.target) {
      document.dispatchEvent(new CustomEvent('close-login-form', {}));
    }
  }

  _switchToRegister(e) {
    this.mode = 'register';
    this.loginClasses = { active: false, inactive: true };
    this.registerClasses = { active: true, inactive: false };
  }

  _switchToLogin(e) {
    this.mode = 'login';
    this.loginClasses = { active: true, inactive: false };
    this.registerClasses = { active: false, inactive: true };
  }

  render() {
    return html`
      <div id="login-container" @click="${this._closeLoginForm}">
        <div id="login-wrapper">
          <div id="login-headers">
            <h1
              class=${classMap(this.loginClasses)}
              @click="${this._switchToLogin}"
            >
              LOGIN
            </h1>
            <h1
              class=${classMap(this.registerClasses)}
              @click="${this._switchToRegister}"
            >
              REGISTER
            </h1>
          </div>
          <label for="email">E-Mail:</label>
          <input
            type="text"
            id="email"
            maxlength="50"
            placeholder="Email address"
            isRequired
          />
          <label for="password">Password:</label>
          <input
            type="password"
            id="password"
            maxlength="80"
            placeholder="Password"
            isRequired
          />

          ${this.mode === 'login'
            ? ''
            : html` <input
                style="margin-top: 6px"
                type="password"
                id="password2"
                maxlength="80"
                placeholder="Repeat password"
                isRequired
              />`}

          <div id="login-buttons">
            ${this.mode === 'login'
              ? html`<button
                  @click="${this._handleLogin}"
                  class="outlined-button"
                  id="login"
                >
                  Login
                </button>`
              : html` <button
                  @click="${this._handleRegister}"
                  class="outlined-button"
                  id="login"
                >
                  Register
                </button>`}
          </div>
        </div>
      </div>
    `;
  }

  createRenderRoot() {
    return this;
  }
}

customElements.define('login-form', LoginForm);
