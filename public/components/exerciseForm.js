import { LitElement, html } from 'lit-element';
import { connect } from 'pwa-helpers';
import { store } from '../src/redux/store';
import { updateExercise } from '../src/redux/actions';
import { nanoid } from 'nanoid';

class ExerciseForm extends connect(store)(LitElement) {
  static get properties() {
    return {
      exId: { type: String },
      currentExercise: { type: Object },
    };
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.exId) {
      this.currentExercise = store.getState().exercises[this.exId];
    } else {
      this.currentExercise = {
        name: '',
        color: '',
        logs: [{ name: '', unit: '' }],
        description: '',
        tags: '',
      };
    }
  }

  _addLog(e) {
    let oldVal = Object.assign(this.currentExercise);
    this.currentExercise.logs.push({ name: '', unit: '' });
    this.requestUpdate(this.currentExercise, oldVal);
  }

  _closeForm(e) {
    if (e) {
      if (document.getElementById('form-container') == e.target) {
        document.dispatchEvent(new CustomEvent('close-exercise-form', {}));
      }
    } else {
      document.dispatchEvent(new CustomEvent('close-exercise-form', {}));
    }
  }

  _saveExercise(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const color = document.getElementById('color').value;
    const description = document.getElementById('description').value;
    const tags = document.getElementById('tags').value;
    for (let i = 0; i < this.currentExercise.logs.length; i++) {
      this.currentExercise.logs[i].name = document.getElementById(
        `name_${i}`
      ).value;
      this.currentExercise.logs[i].unit = document.getElementById(
        `unit_${i}`
      ).value;
    }
    let id = '';
    if (this.exId == null || this.exId == undefined || this.exId == false) {
      id = nanoid(10);
    } else {
      id = this.exId;
    }

    let exerciseObj = {};
    exerciseObj[id] = {
      name,
      color,
      description,
      tags,
      logs: this.currentExercise.logs,
    };

    updateExercise(exerciseObj);

    this._closeForm();
  }

  render() {
    return html`
      <div id="form-container" @click="${this._closeForm}">
        <form id="login-wrapper">
          <label for="name">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            value="${this.currentExercise.name}"
            placeholder="Exercise name"
            isRequired
          />
          <label for="color">Color</label>
          <input
            type="color"
            name="color"
            id="color"
            value="${this.currentExercise.color}"
          />
          ${this.currentExercise.logs.map(
            (item, index) =>
              html`
                <label for="name_${index}">Log ${index + 1}</label>
                <input
                  type="text"
                  name="name_${index}"
                  id="name_${index}"
                  value="${item.name}"
                  placeholder="${index + 1}. Value name to log"
                />
                <label for="unit${index}">Unit ${index + 1}</label>
                <input
                  type="text"
                  name="unit_${index}"
                  id="unit_${index}"
                  value="${item.unit}"
                  placeholder="${index + 1}. Unit"
                />
              `
          )}
          <label for="description">Description</label>
          <input
            type="text"
            name="description"
            placeholder="(optional) Exercise description"
            id="description"
            value="${this.currentExercise.description}"
          />
          <label for="tags">Tags</label>
          <input
            type="text"
            name="tags"
            id="tags"
            placeholder="(optional) Exercise tags"
            value="${this.currentExercise.tags}"
          />
          <input
            type="submit"
            id="exerciseForm-submit"
            @click="${this._saveExercise}"
          />
        </form>
        <button @click="${this._addLog}">Add log</button>
      </div>
    `;
  }

  createRenderRoot() {
    return this;
  }
}

customElements.define('exercise-form', ExerciseForm);
