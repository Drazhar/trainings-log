import { LitElement, html } from 'lit-element';
import { connect } from 'pwa-helpers';
import { store } from '../src/redux/store';
import '../components/workoutForm';
import { displayForm } from '../src/eventListener/openCloseForms';
import { getTrainingData } from '../src/redux/actions';
import '../components/logViews/logCharts';
import '../components/logViews/logTimeline';

class LogView extends connect(store)(LitElement) {
  static get properties() {
    return {
      view: { type: String },
      workouts: { type: Object },
      exercises: { type: Object },
      exerciseOrder: { type: Array },
      exerciseWoData: { type: Object },
    };
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('open-workout-form', displayForm);
    // document.dispatchEvent(new CustomEvent('open-workout-form'));
    getTrainingData();
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
    if (this.exerciseOrder !== state.exerciseOrder) {
      this.exerciseOrder = state.exerciseOrder;
    }
    if (this.exerciseWoData !== state.exerciseWoData) {
      this.exerciseWoData = state.exerciseWoData;
    }
  }

  _changeView() {
    this.view = document.getElementById('viewSetting').value;
  }

  render() {
    let viewHtml = '';
    switch (this.view) {
      case 'timeline':
        viewHtml = html`<log-timeline
          .workouts="${this.workouts}"
          .exercises="${this.exercises}"
        ></log-timeline>`;
        break;
      default:
        viewHtml = html`<log-charts
          .workouts="${this.workouts}"
          .exercises="${this.exercises}"
          .exerciseOrder="${this.exerciseOrder}"
          .exerciseWoData="${this.exerciseWoData}"
        ></log-charts>`;
    }

    return html`
      <div class="view-wrapper">
        <div class="view-header">
          <label for="viewSetting" style="color:white">View: </label>
          <select
            name="viewSetting"
            id="viewSetting"
            @change="${this._changeView}"
          >
            <option value="charts">Charts</option>
            <option value="timeline">Timeline</option>
          </select>
        </div>
        <div class="view-main">
          ${viewHtml}
          <button id="add_workout" @click="${addWorkout}">Add +</button>
        </div>
      </div>
    `;
  }
  createRenderRoot() {
    return this;
  }
}

customElements.define('log-view', LogView);

export function addWorkout(e) {
  let woId = e.target.id.split('+');
  let detail = {};
  if (woId.length > 1) {
    detail = { detail: { woId: woId[1] } };
  }
  document.dispatchEvent(new CustomEvent('open-workout-form', detail));
}
