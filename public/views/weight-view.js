import { LitElement, html } from 'lit-element';
import { connect } from 'pwa-helpers';
import { store } from '../src/redux/store';
import { getTodayDate } from '../../routes/api_helper/utilities';
import { getWeightData } from '../src/redux/actions';
import * as d3 from 'd3';

class WeightView extends connect(store)(LitElement) {
  static get properties() {
    return {
      weightData: { type: Array },
    };
  }

  connectedCallback() {
    super.connectedCallback();
    // window.addEventListener('resize', this.createChart);
    getWeightData();
  }

  // disconnectedCallback() {
  //   window.removeEventListener('resize', this.createChart);
  //   super.disconnectedCallback();
  // }

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
          <div id="weight-chart"></div>
          <form class="input-weight">
            <label for="date">Date </label>
            <input type="date" id="date" value="${getTodayDate()}" isRequired />
            <label for="weight">Weight</label>
            <input type="number" id="weight" isRequired />
            <input type="submit" @click="${this._handleSubmit}" />
          </form>
        </div>
      </div>
    `;
  }

  createChart() {
    const chartArea = document.getElementById('weight-chart');
    chartArea.innerHTML = ''; // delete old chart

    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
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

    // Scales
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
      .call(d3.axisBottom(x))
      .attr('color', 'lightgrey');

    const y = d3
      .scaleLinear()
      .range([height, 0])
      .domain([0, d3.max(this.weightData, (d) => d.weight)]);
    svg.append('g').call(d3.axisLeft(y).ticks(5)).attr('color', 'lightgrey');

    const line = d3
      .line()
      .x((d) => x(d.date))
      .y((d) => y(d.weight));

    svg
      .append('path')
      .attr('d', line(this.weightData))
      .attr('stroke', 'darkgrey')
      .attr('fill', 'none');

    // Dots there are
    svg
      .selectAll('dot')
      .data(this.weightData)
      .enter()
      .append('circle')
      .attr('r', 5)
      .attr('cx', (d) => x(d.date))
      .attr('cy', (d) => y(d.weight))
      .attr('fill', `lightgrey`)
      .append('svg:title')
      .text((d, i) => `blabla`);
  }

  updated() {
    this.createChart();
  }

  createRenderRoot() {
    return this;
  }
}

customElements.define('weight-view', WeightView);
