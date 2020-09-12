import { LitElement, html } from 'lit-element';
import { connect } from 'pwa-helpers';
import { store } from '../src/redux/store';

class LogView extends connect(store)(LitElement) {
  render() {
    return html`<h1>Log view</h1>`;
  }
  createRenderRoot() {
    return this;
  }
}

customElements.define('log-view', LogView);
