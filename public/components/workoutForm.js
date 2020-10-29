import { LitElement, html } from 'lit-element';
import { connect } from 'pwa-helpers';
import { store } from '../src/redux/store';
import { updateWorkout, deleteWorkout } from '../src/redux/actions';
import { nanoid } from 'nanoid';
import { backendAddress } from '../src/env';
import { getSqlDate } from '../../routes/api_helper/utilities';
import './timer';

class WorkoutForm extends connect(store)(LitElement) {
  static get properties() {
    return {
      currentWorkout: { type: Object },
      exercises: { type: Object },
      woId: { type: String },
      newWo: { type: Boolean },
    };
  }

  stateChanged(state) {
    if (this.exercises !== state.exercises) {
      this.exercises = state.exercises;
    }
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.woId) {
      this.currentWorkout = store.getState().workouts[this.woId];
      this.currentWorkout.date = getSqlDate(this.currentWorkout.date);
      this.newWo = false;
    } else {
      this.newWo = true;
      this.woId = nanoid(10);
      this.currentWorkout = {
        date: getSqlDate(new Date()),
        exercises: [],
        comment: '',
        mood: '',
      };
    }
  }

  getDefaultExercise() {
    const defaultExerciseId = Object.keys(this.exercises)[0];
    let defaultSets = [];

    defaultSets.push(
      new Array(this.exercises[defaultExerciseId].logs.length).fill(1)
    );

    return {
      id: defaultExerciseId,
      sets: defaultSets,
      mood: '',
    };
  }

  _addExercise(e) {
    e.preventDefault();

    this.currentWorkout = Object.assign({}, this.currentWorkout, {
      exercises: [...this.currentWorkout.exercises, this.getDefaultExercise()],
    });

    this.updateComplete.then(() => {
      let newCard = document.getElementsByClassName('workout-exercise-card');
      newCard = newCard[newCard.length - 1];

      newCard.scrollIntoView({ behavior: 'smooth' });
    });
  }

  _changeExercise(e) {
    const id = parseInt(e.target.id.split('_')[1]);
    const exerciseId = document.getElementById(e.target.id).value;
    this.currentWorkout.exercises[id].id = exerciseId;
    this.requestUpdate(this.currentWorkout, '');
    this.currentWorkout.exercises[id].sets[0] = new Array(
      this.exercises[exerciseId].logs.length
    ).fill(0);
    // console.log(this.currentWorkout);
  }

  _removeExercise(e) {
    e.preventDefault();
    const id = parseInt(e.target.id.split('_')[1]);

    this.currentWorkout.exercises.splice(id, 1);
    this.requestUpdate(this.currentWorkout, '');
  }

  _addSet(e) {
    e.preventDefault();
    const idToAddTo = parseInt(e.target.id.split('_')[1]);
    const oldVal = Object.assign({}, this.currentWorkout);
    this.currentWorkout.exercises[idToAddTo].sets.push(
      new Array(this.currentWorkout.exercises[idToAddTo].sets[0].length).fill(0)
    );
    this.requestUpdate(this.currentWorkout, oldVal);
  }

  _removeSet(e) {
    e.preventDefault();
    const target = e.target.id.split('_');
    const exToRemoveFrom = parseInt(target[1]);
    const setToRemove = parseInt(target[2]);

    this.currentWorkout.exercises[exToRemoveFrom].sets.splice(setToRemove, 1);
    this.requestUpdate(this.currentWorkout, '');
  }

  _closeForm(e) {
    // CHECK IF THERE IS SOMETHING TO SAVE
    document.dispatchEvent(new CustomEvent('close-workout-form', {}));
  }

  _saveWorkout(e) {
    e.preventDefault();
    // console.log(this.currentWorkout);

    this.currentWorkout.date = document.getElementById('date').value;
    this.currentWorkout.exercises.forEach((exercise, exIndex) => {
      exercise.sets.forEach((currentSet, setIndex) => {
        currentSet.forEach((setData, dataIndex) => {
          this.currentWorkout.exercises[exIndex].sets[setIndex][
            dataIndex
          ] = parseInt(
            document.getElementById(`value_${exIndex}_${setIndex}_${dataIndex}`)
              .value
          );
        });
      });
    });
    let reduxObj = {};
    reduxObj[this.woId] = this.currentWorkout;
    reduxObj[this.woId].date = new Date(this.currentWorkout.date);

    updateWorkout(reduxObj);

    this.requestUpdate(this.currentWorkout, '');

    // SEND TO BACKEND FOR DATABASE
    fetch(`${backendAddress}/api/editWorkout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reduxObj),
    });

    this._closeForm();
  }

  _deleteWorkout(e) {
    e.preventDefault();
    deleteWorkout(this.woId);

    this._closeForm();
  }

  render() {
    return html`
      <div id="fullscreen-popup">
        <form>
          <input
            type="date"
            id="date"
            name="date"
            value="${this.currentWorkout.date}"
          />
          <button @click="${this._addExercise}">Add Exercise</button>
          ${this.newWo === false
            ? html`<button @click="${this._deleteWorkout}">
                Delete Workout
              </button>`
            : html``}
          <workout-timer></workout-timer>

          ${this.currentWorkout.exercises.map((exercise, exIndex) => {
            return html`
              <div
                class="workout-exercise-card"
                style="background-color:${this.exercises[exercise.id].color}"
              >
                <select
                  name="selectExerciseId_${exIndex}"
                  id="selectExerciseId_${exIndex}"
                  @change=${this._changeExercise}
                >
                  ${Object.keys(this.exercises).map((key) => {
                    if (key == exercise.id) {
                      const selected = "selected='selected'";
                    } else {
                      const selected = '';
                    }
                    return html`
                      ${key == exercise.id
                        ? html`<option value="${key}" selected>
                            ${this.exercises[key].name}
                          </option>`
                        : html`<option value="${key}">
                            ${this.exercises[key].name}
                          </option>`}
                    `;
                  })}
                </select>

                <table>
                  <tr>
                    <td>Set</td>
                    ${this.exercises[exercise.id].logs.map((logInfo) => {
                      return html` <td>${logInfo.name}</td> `;
                    })}
                  </tr>
                  ${exercise.sets.map((currentSet, setIndex) => {
                    return html`
                      <tr>
                        <td>${setIndex + 1}</td>
                        ${currentSet.map((setData, dataIndex) => {
                          return html`<td>
                            <input
                              type="number"
                              id="value_${exIndex}_${setIndex}_${dataIndex}"
                              value="${setData}"
                              style="width:20vw"
                            />
                          </td> `;
                        })}
                        <td>
                          <button
                            id="removeSet_${exIndex}_${setIndex}"
                            @click="${this._removeSet}"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    `;
                  })}
                </table>
                <button
                  style="margin: 5px"
                  id="addSet_${exIndex}"
                  @click="${this._addSet}"
                >
                  Add set
                </button>
                <button
                  style="margin: 5px"
                  id="removeExercise_${exIndex}"
                  @click="${this._removeExercise}"
                >
                  Remove Exercise
                </button>
              </div>
            `;
          })}

          <div style="height: 70px"></div>
          <input
            type="submit"
            value="Save"
            id="save-workout"
            class="outlined-button"
            @click="${this._saveWorkout}"
          />
        </form>
        <button
          id="close-workout"
          @click="${this._closeForm}"
          class="outlined-button"
        >
          Close
        </button>
      </div>
    `;
  }

  createRenderRoot() {
    return this;
  }
}

customElements.define('workout-form', WorkoutForm);
