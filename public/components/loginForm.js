import { LitElement, html } from 'lit-element';

class LoginForm extends LitElement {
  _handleLogin(e) {
    console.log('Login clicked');
    console.log(e);
  }

  _handleRegister(e) {
    console.log('Register clicked');
    console.log(e);
  }

  render() {
    return html`
      <div id="login-container">
        <div id="login-wrapper">
          <h1>Login</h1>
          <label for="email">E-Mail:</label>
          <input type="text" id="email" value="Test@email.com" isRequired />
          <label for="password">Password:</label>
          <input type="password" id="password" value="blablabalba" isRequired />

          <div id="login-buttons">
            <button
              @click="${this._handleLogin}"
              class="outlined-button"
              id="login"
            >
              Login
            </button>
            <button @click="${this._handleRegister}" class="outlined-button">
              Register
            </button>
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
