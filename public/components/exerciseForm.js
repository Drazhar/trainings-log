import { LitElement, html } from 'lit-element';
import { connect } from 'pwa-helpers';
import { store } from '../src/redux/store';
import { updateUserAuthenticated } from '../src/redux/actions';
import { backendAddress } from '../src/env';

class ExerciseForm extends connect(store)(LitElement) {
  _closeForm(e) {
    if (document.getElementById('form-container') == e.target) {
      document.dispatchEvent(new CustomEvent('close-exercise-form', {}));
    }
  }

  render() {
    return html`
      <div id="form-container" @click="${this._closeForm}">
        <form id="login-wrapper">
          <p>Das werden mal die Übungen</p>
        </form>
      </div>
    `;
  }

  createRenderRoot() {
    return this;
  }
}

customElements.define('exercise-form', ExerciseForm);
