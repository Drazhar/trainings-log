import { LitElement, html } from 'lit-element';
import { connect } from 'pwa-helpers';
import { store } from '../../src/redux/store';
import { addWorkout } from '../../views/log-view';

class logTimeline extends connect(store)(LitElement) {
  static get properties() {
    return {
      workouts: { type: Object },
      exercises: { type: Object },
    };
  }

  render() {
    return html` <table style="color:white">
      <thead>
        <tr>
          <td>Date</td>
          <td>Exercises</td>
          <td>Actions</td>
        </tr>
      </thead>
      <tbody>
        ${Object.keys(this.workouts).map((key) => {
          return html` <tr>
            <td>${this.workouts[key].date.toLocaleDateString()}</td>
            <td>
              ${this.workouts[key].exercises.map(
                (woEx) => html`<p>${this.exercises[woEx.id].name}</p>`
              )}
            </td>
            <td>
              <button id="editWo+${key}" @click="${addWorkout}">Edit</button>
            </td>
          </tr>`;
        })}
      </tbody>
    </table>`;
  }
}

customElements.define('log-timeline', logTimeline);
