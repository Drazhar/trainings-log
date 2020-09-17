import { LitElement, html } from 'lit-element';
import { connect } from 'pwa-helpers';
import { store } from '../src/redux/store';
import { updateExercise } from '../src/redux/actions';
import { nanoid } from 'nanoid';
import { backendAddress } from '../src/env';

class WorkoutForm extends connect(store)(LitElement) {
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
          <div class="workout-exercise-card">
            <h3>Klimmzüge</h3>
            <div style="margin:5px">
              <span>1. Set:</span>
              <input type="number" name="kz_0" id="kz_0" />
            </div>
            <div style="margin:5px">
              <span>2. Set:</span>
              <input type="number" name="kz_0" id="kz_0" />
            </div>

            <button style="margin: 5px">Add set</button>
          </div>

          <div
            class="workout-exercise-card"
            style="background-color: rgb(87,42,40)"
          >
            <h3>Liegestütz</h3>
            <div style="margin:5px">
              <span>1. Set:</span>
              <input type="number" name="kz_0" id="kz_0" />
            </div>
            <div style="margin:5px">
              <span>2. Set:</span>
              <input type="number" name="kz_0" id="kz_0" />
            </div>
            <div style="margin:5px">
              <span>3. Set:</span>
              <input type="number" name="kz_0" id="kz_0" step="1" />
            </div>

            <button style="margin: 5px">Add set</button>
          </div>

          <button>Add Exercise</button>
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
