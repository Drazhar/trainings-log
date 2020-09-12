import { LitElement, html } from 'lit-element';
import { connect } from 'pwa-helpers';
import { store } from '../src/redux/store';

class ExerciseView extends connect(store)(LitElement) {
  render() {
    return html`<h1>Exercise view</h1>`;
  }
  createRenderRoot() {
    return this;
  }
}

customElements.define('exercise-view', ExerciseView);
