import { LitElement, html } from 'lit-element';
import { connect } from 'pwa-helpers';
import { store } from '../src/redux/store';
import '../components/workoutForm';
import { displayForm } from '../src/eventListener/openCloseForms';
import { getExercises, getWorkouts } from '../src/redux/actions';
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
      this.exerciseWoData = getExerciseWoData(this.workouts);
    }
    if (this.exercises !== state.exercises) {
      this.exercises = state.exercises;
      this.exerciseOrder = getExerciseOrder(this.exercises);
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

function getExerciseOrder(exercises) {
  let result = [];
  Object.keys(exercises).forEach((key) => {
    result.push([key, exercises[key].lastUsed, exercises[key].count]);
  });
  result.sort((a, b) => {
    for (let i = 1; i < a.length; i++) {
      if (a[i] < b[i]) {
        return 1;
      } else if (a[i] > b[i]) {
        return -1;
      }
    }
    return 0;
  });
  return result;
}

function getExerciseWoData(workouts) {
  let result = {};

  Object.keys(workouts).forEach((woKey) => {
    const currentWo = workouts[woKey];
    currentWo.exercises.forEach((ex) => {
      console.log(ex);
      if (!(ex.id in result)) {
        result[ex.id] = [];
      }
      let sum = new Array(ex.sets[0].length).fill(0);
      let setCount = 0;
      ex.sets.forEach((set) => {
        set.forEach((value, index) => {
          sum[index] += value;
        });
        setCount++;
      });
      result[ex.id].push([currentWo.date, [...sum], setCount]);
    });
  });

  return result;
}

export function addWorkout(e) {
  let woId = e.target.id.split('+');
  let detail = {};
  if (woId.length > 1) {
    detail = { detail: { woId: woId[1] } };
  }
  document.dispatchEvent(new CustomEvent('open-workout-form', detail));
}
