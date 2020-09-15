import { LitElement, html } from 'lit-element';
import { connect } from 'pwa-helpers';
import { store } from '../src/redux/store';
import '../components/exerciseForm';
import { displayForm } from '../src/eventListener/openCloseForms';

class ExerciseView extends connect(store)(LitElement) {
  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('open-exercise-form', displayForm);
  }

  disconnectedCallback() {
    document.removeEventListener('open-exercise-form', displayForm);
    super.disconnectedCallback();
  }

  _addExercise(e) {
    document.dispatchEvent(new CustomEvent('open-exercise-form', {}));
  }

  render() {
    return html`<div class="view-wrapper">
      <div class="view-header"></div>
      <div class="view-main"></div>
      <button id="add_exercise" @click="${this._addExercise}">Add +</button>
    </div>`;
  }
  createRenderRoot() {
    return this;
  }
}

customElements.define('exercise-view', ExerciseView);
