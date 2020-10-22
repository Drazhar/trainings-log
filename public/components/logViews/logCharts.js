import { LitElement, html } from 'lit-element';
import { connect } from 'pwa-helpers';
import { store } from '../../src/redux/store';
import '../logChart';

class logCharts extends connect(store)(LitElement) {
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
    console.log(this.exerciseWoData);
    console.log(this.workouts);
  }

  render() {
    return html`
      <table style="width:100%">
        <tbody>
          ${this.exerciseOrder.map((exInfo) => {
            if (exInfo[2] > 0) {
              return html`
                <tr>
                  <td
                    style="background-color:black;display:flex;align-items: stretch;justify-content:stretch;height:100px;overflow:hidden"
                  >
                    <log-chart
                      style="flex-grow:1"
                      .chartData="${this.exerciseWoData[exInfo[0]]}"
                      .color="${this.exercises[exInfo[0]].color}"
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
    `;
  }
}

customElements.define('log-charts', logCharts);
