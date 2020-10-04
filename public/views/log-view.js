import { LitElement, html } from 'lit-element';
import { connect } from 'pwa-helpers';
import { store } from '../src/redux/store';
import '../components/workoutForm';
import { displayForm } from '../src/eventListener/openCloseForms';
import { getExercises, getWorkouts } from '../src/redux/actions';
import '../components/logChart';

class LogView extends connect(store)(LitElement) {
  static get properties() {
    return {
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
      console.log(this.exerciseOrder);
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
          <table style="width:100%">
            <tbody>
              ${this.exerciseOrder.map((exInfo) => {
                if (exInfo[2] > 0) {
                  console.log(this.exercises[exInfo[0]].name);
                  return html`
                    <tr>
                      <td
                        style="background-color:black;display:flex;align-items: stretch;justify-content:stretch;height:100px;overflow:hidden"
                      >
                        <log-chart
                          style="flex-grow:1"
                          .chartData="${this.exerciseWoData[exInfo[0]]}"
                        ></log-chart>
                        <table
                          style="background-color:red;width:30%;min-width:50px;max-width:150px;overflow:hidden"
                        >
                          <tbody>
                            <tr>
                              ${this.exercises[exInfo[0]].name}
                            </tr>
                            <tr>
                              ${exInfo[2]}
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  `;
                }
              })}
            </tbody>
          </table>
          <button id="add_workout" @click="${this._addWorkout}">Add +</button>
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
      if (!(ex.id in result)) {
        result[ex.id] = [];
      }
      result[ex.id].push([currentWo.date, ex.sets]);
    });
  });

  return result;
}
