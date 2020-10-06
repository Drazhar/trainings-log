import { LitElement, html } from 'lit-element';
import { connect } from 'pwa-helpers';
import { store } from '../src/redux/store';
import '../components/exerciseForm';
import { displayForm } from '../src/eventListener/openCloseForms';
import { getExercises, removeExercise } from '../src/redux/actions';
import { backendAddress } from '../src/env';

class ExerciseView extends connect(store)(LitElement) {
  static get properties() {
    return {
      exercises: { type: Object },
    };
  }

  stateChanged(state) {
    if (this.exercises !== state.exercises) {
      this.exercises = state.exercises;
    }
  }

  connectedCallback() {
    super.connectedCallback();
    getExercises();
    document.addEventListener('open-exercise-form', displayForm);
  }

  disconnectedCallback() {
    document.removeEventListener('open-exercise-form', displayForm);
    super.disconnectedCallback();
  }

  _addExercise(e) {
    let exId = e.target.id.split('+');
    let detail = {};
    if (exId.length > 1) {
      detail = { detail: { exId: exId[1] } };
    }
    document.dispatchEvent(new CustomEvent('open-exercise-form', detail));
  }

  _removeExercise(e) {
    const id = e.target.id.split('+')[1];
    fetch(`${backendAddress}/api/removeExercise`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });

    removeExercise(id);
  }

  render() {
    return html`<div class="view-wrapper">
      <div class="view-header">
        <label for="tagsFilter" style="color:white">Filter Tags: </label>
        <select name="tagsFilter" id="tagsFilter">
          <option value="1">1 Month</option>
          <option value="3">3 Month</option>
          <option value="6">6 Month</option>
          <option value="12">1 Year</option>
          <option value="0">all</option>
        </select>
        <label for="colorFilter" style="color:white">Filter Color: </label>
        <select name="colorFilter" id="colorFilter">
          <option value="1">1 Month</option>
          <option value="3">3 Month</option>
          <option value="6">6 Month</option>
          <option value="12">1 Year</option>
          <option value="0">all</option>
        </select>
      </div>
      <div class="view-main">
        <table>
          ${Object.keys(this.exercises).map((key) => {
            const current = this.exercises[key];
            return html`
              <tr style="background-color:${this.exercises[key].color}">
                <td style="color:white;">${current.name}</td>
                <td>
                  <button id="editEx+${key}" @click="${this._addExercise}">
                    edit
                  </button>
                </td>
                <td>
                  <button id="deleteEx+${key}" @click="${this._removeExercise}">
                    delete
                  </button>
                </td>
              </tr>
            `;
          })}
        </table>
      </div>
      <button id="add_exercise" @click="${this._addExercise}">Add +</button>
    </div>`;
  }
  createRenderRoot() {
    return this;
  }
}

customElements.define('exercise-view', ExerciseView);
