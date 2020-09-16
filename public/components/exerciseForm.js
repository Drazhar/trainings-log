import { LitElement, html } from 'lit-element';
import { connect } from 'pwa-helpers';
import { store } from '../src/redux/store';
import { updateUserAuthenticated } from '../src/redux/actions';
import { backendAddress } from '../src/env';

class ExerciseForm extends connect(store)(LitElement) {
  static get properties() {
    return {
      logs: { type: Array },
    };
  }

  constructor() {
    super();
    this.logs = [];
  }

  _addLog(e) {
    let oldVal = [...this.logs];
    this.logs.push({ name: '', unit: '' });
    this.requestUpdate(this.logs, oldVal);
  }

  _closeForm(e) {
    if (document.getElementById('form-container') == e.target) {
      document.dispatchEvent(new CustomEvent('close-exercise-form', {}));
    }
  }

  render() {
    return html`
      <div id="form-container" @click="${this._closeForm}">
        <form id="login-wrapper">
          <label for="name">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Exercise name"
            isRequired
          />
          <label for="description">Description</label>
          <input
            type="text"
            name="description"
            placeholder="(optional) Exercise description"
            id="description"
          />
          <label for="tags">Tags</label>
          <input
            type="text"
            name="tags"
            id="tags"
            placeholder="(optional) Exercise tags"
          />
          <label for="color">Color</label>
          <input type="color" name="color" id="color" />
          ${this.logs.map(
            (item, index) =>
              html`
                <label for="log_${index}">Log ${index + 1}</label>
                <input
                  type="text"
                  name="log_${index}"
                  id="log_${index}"
                  value="${item.name}"
                  placeholder="${index + 1}. Value name to log"
                />
              `
          )}
        </form>
        <button @click="${this._addLog}">Add log</button>
      </div>
    `;
  }

  createRenderRoot() {
    return this;
  }
}

customElements.define('exercise-form', ExerciseForm);
