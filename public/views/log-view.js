import { LitElement, html } from 'lit-element';
import { connect } from 'pwa-helpers';
import { store } from '../src/redux/store';
import '../components/workoutForm';
import { displayForm } from '../src/eventListener/openCloseForms';
import { getExercises, getWorkouts } from '../src/redux/actions';

class LogView extends connect(store)(LitElement) {
  static get properties() {
    return {
      workouts: { type: Object },
      exercises: { type: Object },
    };
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('open-workout-form', displayForm);
    // document.dispatchEvent(new CustomEvent('open-workout-form'));
    getWorkouts();
    getExercises();
  }

  disconnectedCallback() {
    document.removeEventListener('open-workout-form', displayForm);
    super.disconnectedCallback();
  }

  stateChanged(state) {
    if (this.workouts !== state.workouts) {
      this.workouts = state.workouts;
    }
    if (this.exercises !== state.exercises) {
      this.exercises = state.exercises;
    }
  }

  _addWorkout(e) {
    let exId = e.target.id.split('+');
    let detail = {};
    if (exId.length > 1) {
      detail = { detail: { exId: exId[1] } };
    }
    document.dispatchEvent(new CustomEvent('open-workout-form', detail));
  }

  render() {
    return html`
      <div class="view-wrapper">
        <div class="view-header"></div>
        <div class="view-main">
          <table>
            ${Object.keys(this.workouts).map((key) => {
              const current = this.workouts[key];
              return html`
                <tr>
                  ${current.exercises.map((woEx) => {
                    return html`<td style="color:white;font-size:x-small;">
                      ${this.exercises[woEx.id].name}
                    </td>`;
                  })}
                  <td>
                    <button id="editEx+${key}" @click="${this._addExercise}">
                      edit
                    </button>
                  </td>
                  <td>
                    <button
                      id="deleteEx+${key}"
                      @click="${this._removeExercise}"
                    >
                      delete
                    </button>
                  </td>
                </tr>
              `;
            })}
          </table>
        </div>
        <button id="add_workout" @click="${this._addWorkout}">Add +</button>
      </div>
    `;
  }
  createRenderRoot() {
    return this;
  }
}

customElements.define('log-view', LogView);
