import { LitElement, html } from 'lit-element';
import { connect } from 'pwa-helpers';
import { store } from '../src/redux/store';
import { getTodayDate } from '../../routes/api_helper/utilities';
import { getWeightData } from '../src/redux/actions';
import * as d3 from 'd3';
import { curveBasis } from 'd3';
import { getMovingAverage } from '../src/movingAverage';

class WeightView extends connect(store)(LitElement) {
  static get properties() {
    return {
      weightData: { type: Array },
      movingAverage: { type: Array },
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this._updateWeight();
  }

  _updateWeight() {
    let range = document.getElementById('weightRange');

    if (range === null) {
      range = 1;
    } else {
      range = parseInt(range.value);
    }

    if (range === 0) {
      getWeightData();
    } else {
      getWeightData(getTodayDate(range), getTodayDate());
    }
  }

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

    /* ADD DATA TO STATE! */
    this._updateWeight();
  }

  stateChanged(state) {
    if (this.weightData !== state.weightData) {
      this.weightData = state.weightData;
      this.movingAverage = getMovingAverage(this.weightData, 5);
    }
  }

  render() {
    return html`
      <div class="view-wrapper">
        <div class="view-header">
          <label for="weightRange" style="color:white">Max range: </label>
          <select
            name="weightRange"
            id="weightRange"
            @change="${this._updateWeight}"
          >
            <option value="1">1 Month</option>
            <option value="3">3 Month</option>
            <option value="6">6 Month</option>
            <option value="12">1 Year</option>
            <option value="0">all</option>
          </select>
        </div>
        <div class="view-main">
          <div id="weight-chart"></div>
          <form class="input-weight">
            <label for="date">Date </label>
            <input type="date" id="date" value="${getTodayDate()}" isRequired />
            <label for="weight">Weight</label>
            <input type="number" id="weight" isRequired />
            <input type="submit" @click="${this._handleSubmit}" />
          </form>
          <table
            id="weightRawData"
            style="color:white; width:99%; margin-top: 1em"
          >
            ${[...this.weightData].reverse().map((entry) => {
              return html`<tr>
                <td>
                  ${entry.date.getDate() < 10
                    ? '0' + entry.date.getDate()
                    : entry.date.getDate()}.${entry.date.getMonth() + 1 < 10
                    ? '0' + (entry.date.getMonth() + 1)
                    : entry.date.getMonth() + 1}.${entry.date.getFullYear()}
                </td>
                <td>${entry.weight}</td>
              </tr>`;
            })}
          </table>
        </div>
      </div>
    `;
  }

  updated() {
    this.createChart();
  }

  createChart() {
    const chartArea = document.getElementById('weight-chart');
    chartArea.innerHTML = ''; // delete old chart

    const margin = { top: 15, right: 30, bottom: 20, left: 30 };
    const width = chartArea.clientWidth - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    // Create the chart itself
    const svg = d3
      .select(chartArea)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X SCALE AND AXIS
    const x = d3
      .scaleTime()
      .range([0, width])
      .domain([
        d3.min(this.weightData, (d) => d.date),
        d3.max(this.weightData, (d) => d.date),
      ]);
    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5).tickSize(-height))
      .attr('color', 'lightgrey');

    // Y SCALE AND AXIS
    const y = d3
      .scaleLinear()
      .range([height, 0])
      .domain([
        d3.min(this.weightData, (d) => d.weight) - 5,
        d3.max(this.weightData, (d) => d.weight) + 5,
      ])
      .nice();
    svg
      .append('g')
      .call(d3.axisLeft(y).ticks(4).tickSize(-width))
      .attr('color', 'lightgrey');

    // CREATE LINE
    const lineSmooth = d3
      .line()
      .x((d) => x(d.date))
      .y((d) => y(d.weight))
      .curve(curveBasis);

    svg
      .append('path')
      .attr('d', lineSmooth(this.movingAverage))
      .attr('stroke', '#29a6c9')
      .attr('stroke-width', 3)
      .attr('fill', 'none')
      .attr('stroke-linejoin', 'round');

    // CREATE DOTS
    svg
      .selectAll('dot')
      .data(this.weightData)
      .enter()
      .append('circle')
      .attr('r', 2)
      .attr('cx', (d) => x(d.date))
      .attr('cy', (d) => y(d.weight))
      .attr('fill', `RGBA(240,240,240,0.3)`)
      .append('svg:title')
      .text((d, i) => `blabla`);
  }

  createRenderRoot() {
    return this;
  }
}

customElements.define('weight-view', WeightView);
