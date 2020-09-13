import { LitElement, html } from 'lit-element';
import { connect } from 'pwa-helpers';
import { store } from '../src/redux/store';
import { getTodayDate } from '../../routes/api_helper/utilities';
import { getWeightData } from '../src/redux/actions';

class WeightView extends connect(store)(LitElement) {
  _handleSubmit(e) {
    e.preventDefault();

    const inputForm = document.getElementsByClassName('input-weight');
    const weight = inputForm[0].querySelector('#weight').value;
    const date = inputForm[0].querySelector('#date').value;

    fetch('http://localhost:3000/api/addWeight', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ date, weight }),
    });
  }

  stateChanged(state) {
    this.weightData = state.weightData;
  }

  render() {
    return html`
      <div class="view-wrapper">
        <div class="view-header">
          <div></div>
          <login-icon id="avatar"></login-icon>
        </div>
        <div class="view-main">
          <form class="input-weight">
            <label for="date">Date </label>
            <input type="date" id="date" value="${getTodayDate()}" isRequired />
            <label for="weight">Weight</label>
            <input type="number" id="weight" isRequired />
            <input type="submit" @click="${this._handleSubmit}" />
          </form>

          <button @click="${getWeightData}">refresh</button>
        </div>
      </div>
    `;
  }
  createRenderRoot() {
    return this;
  }
}

customElements.define('weight-view', WeightView);
