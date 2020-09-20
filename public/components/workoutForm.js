import { LitElement, html } from 'lit-element';
import { connect } from 'pwa-helpers';
import { store } from '../src/redux/store';
import { updateExercise } from '../src/redux/actions';
import { nanoid } from 'nanoid';
import { backendAddress } from '../src/env';

class WorkoutForm extends connect(store)(LitElement) {
  static get properties() {
    return {
      currentWorkout: { type: Object },
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
    if (this.exId) {
      this.currentWorkout = store.getState().workouts[this.exId];
    } else {
      this.currentWorkout = {
        datetime: '',
        exercises: [],
        comment: '',
        mood: '',
      };
    }
  }

  getDefaultExercise() {
    const defaultExerciseId = Object.keys(this.exercises)[0];
    let defaultSets = [];
    this.exercises[defaultExerciseId].logs.forEach(() => {
      defaultSets.push([1]);
    });

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
  }

  _changeExercise(e) {
    const id = parseInt(e.target.id.split('_')[1]);
    const exerciseId = document.getElementById(e.target.id).value;
    this.currentWorkout.exercises[id].id = exerciseId;
    this.requestUpdate(this.currentWorkout, '');
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
    this.currentWorkout.exercises[idToAddTo].sets.push([2]);
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

  render() {
    return html`
      <div id="fullscreen-popup">
        <!-- Timer oben -->

        <form>
          <input type="date" id="date" name="date" />

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
                    return html`
                      <option value="${key}">
                        ${this.exercises[key].name}
                      </option>
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
                        ${currentSet.map((setData) => {
                          return html`<td>
                              <input type="number" value="${setData}" />
                            </td>
                            <td>
                              <button
                                id="removeSet_${exIndex}_${setIndex}"
                                @click="${this._removeSet}"
                              >
                                Remove
                              </button>
                            </td> `;
                        })}
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

          <button @click="${this._addExercise}">Add Exercise</button>
          <div style="height: 70px"></div>
          <input
            type="submit"
            value="Save"
            id="save-workout"
            class="outlined-button"
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
