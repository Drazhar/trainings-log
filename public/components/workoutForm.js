import { LitElement, html } from 'lit-element';
import { connect } from 'pwa-helpers';
import { store } from '../src/redux/store';
import { updateWorkout, deleteWorkout } from '../src/redux/actions';
import { nanoid } from 'nanoid';
import { getSqlDate } from '../../routes/api_helper/utilities';
import { increase, decrease } from '../src/increase_decrease';
import './timer';

class WorkoutForm extends connect(store)(LitElement) {
  static get properties() {
    return {
      currentWorkout: { type: Object },
      exercises: { type: Object },
      woId: { type: String },
      newWo: { type: Boolean },
      exerciseOrder: { type: Array },
      exerciseWoData: { type: Object },
    };
  }

  stateChanged(state) {
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
      this._addExercise();
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
    try {
      e.preventDefault();
    } catch {}

    this.currentWorkout = Object.assign({}, this.currentWorkout, {
      exercises: [...this.currentWorkout.exercises, this.getDefaultExercise()],
    });

    this.updateComplete.then(() => {
      let newCard = document.getElementsByClassName('workout-exercise-card');
      newCard = newCard[newCard.length - 1];

      newCard.scrollIntoView({ behavior: 'smooth' });
      this._changeExercise({
        target: newCard.getElementsByTagName('select')[0],
      });
    });
  }

  _changeExercise(e) {
    const id = parseInt(e.target.id.split('_')[1]);
    const exerciseId = document.getElementById(e.target.id).value;
    this.currentWorkout.exercises[id].id = exerciseId;
    this.requestUpdate(this.currentWorkout, '');
    if (this.exercises[exerciseId].lastEntries) {
      this.currentWorkout.exercises[id].sets = [];
      for (let i = 0; i < this.exercises[exerciseId].lastEntries.length; i++) {
        this.currentWorkout.exercises[id].sets.push([]);
        for (
          let j = 0;
          j < this.exercises[exerciseId].lastEntries[0].length;
          j++
        ) {
          this.currentWorkout.exercises[id].sets[i].push(['']);
        }
      }
    } else {
      this.currentWorkout.exercises[id].sets = [
        new Array(this.exercises[exerciseId].logs.length).fill(''),
      ];
    }
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
      new Array(this.currentWorkout.exercises[idToAddTo].sets[0].length).fill(
        ''
      )
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
            const placeholder = this.exercises[exercise.id].lastEntries;
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
                  ${this.exerciseOrder.map((item) => {
                    return html`
                      ${item[0] == exercise.id
                        ? html`<option value="${item[0]}" selected>
                            ${this.exercises[item[0]].name}
                          </option>`
                        : html`<option value="${item[0]}">
                            ${this.exercises[item[0]].name}
                          </option>`}
                    `;
                  })}
                </select>

                <table>
                  <tr>
                    <td>Set</td>
                    ${this.exercises[exercise.id].logs.map((logInfo) => {
                      console.log(logInfo);
                      return html` <td>${logInfo.name}</td> `;
                    })}
                  </tr>
                  ${exercise.sets.map((currentSet, setIndex) => {
                    return html`
                      <tr>
                        <td>${setIndex + 1}</td>
                        ${currentSet.map(
                          (setData, dataIndex) => html` <td>
                            <div class="wo_input">
                              <input
                                type="number"
                                id="value_${exIndex}_${setIndex}_${dataIndex}"
                                value="${setData}"
                                placeholder="${placeholder
                                  ? placeholder.length > setIndex
                                    ? placeholder[setIndex][dataIndex]
                                    : ''
                                  : ''}"
                                style="width:3em"
                              />
                              <div
                                class="woIncDecBut"
                                for="value_${exIndex}_${setIndex}_${dataIndex}"
                                @click="${decrease}"
                              >
                                -
                              </div>
                              <div
                                class="woIncDecBut"
                                for="value_${exIndex}_${setIndex}_${dataIndex}"
                                @click="${increase}"
                              >
                                +
                              </div>
                            </div>
                          </td>`
                        )}
                        <td>
                          <button
                            style="margin-left:2em"
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
                  style="margin: 1.5em 0 0 1.5em"
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
