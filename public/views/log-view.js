import { LitElement, html } from 'lit-element';
import { connect } from 'pwa-helpers';
import { store } from '../src/redux/store';
import '../components/workoutForm';
import { displayForm } from '../src/eventListener/openCloseForms';
import { getExercises } from '../src/redux/actions';
import { backendAddress } from '../src/env';

class LogView extends connect(store)(LitElement) {
  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('open-workout-form', displayForm);
    // document.dispatchEvent(new CustomEvent('open-workout-form'));

    fetch(`${backendAddress}/api/getWorkouts`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((workouts) => {
        console.log(workouts);
      });

    getExercises();
  }

  disconnectedCallback() {
    document.removeEventListener('open-workout-form', displayForm);
    super.disconnectedCallback();
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
        <div class="view-main"></div>
        <button id="add_workout" @click="${this._addWorkout}">Add +</button>
      </div>
    `;
  }
  createRenderRoot() {
    return this;
  }
}

customElements.define('log-view', LogView);
