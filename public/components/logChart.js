import { LitElement, html, css } from 'lit-element';
import { connect } from 'pwa-helpers';
import { store } from '../src/redux/store';
import {
  select,
  curveBasis,
  scaleTime,
  scalePow,
  scaleLinear,
  line,
  axisLeft,
  min,
  max,
  axisBottom,
} from 'd3';

class LogChart extends connect(store)(LitElement) {
  static get properties() {
    return {
      chartData: { type: Array },
    };
  }

  firstUpdated() {
    console.log(this.chartData);
    const chartArea = this.shadowRoot.getElementById('chart');
    chartArea.innerHTML = ''; // delete old chart

    const margin = { top: 15, right: 20, bottom: 20, left: 20 };
    const width = chartArea.clientWidth - margin.left - margin.right;
    const height = 100 - margin.top - margin.bottom;

    const svg = select(chartArea)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const today = new Date();
    const x = scalePow().exponent(0.5).range([0, width]).domain([
      // min(this.weightData, (d) => (d.date - today) / 1000 / 60 / 60 / 24),
      -60,
      10,
    ]);
    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(axisBottom(x).ticks(4).tickSize(-height))
      .attr('color', 'RGBA(240,240,240,0.4)');

    let yMax = max(this.chartData, (d) => d[1][0][0]) + 2;
    if (yMax < 12) {
      yMax = 12;
    }
    const y = scaleLinear().range([height, 0]).domain([0, yMax]);
    svg
      .append('g')
      .call(axisLeft(y).ticks(4).tickSize(-width))
      .attr('color', 'RGBA(240,240,240,0.4)');

    svg
      .selectAll('dot')
      .data(this.chartData)
      .enter()
      .append('circle')
      .attr('r', 2)
      .attr('cx', (d) => x((d[0] - today) / 86400000))
      .attr('cy', (d) => y(d[1][0][0]))
      .attr('fill', `RGBA(240,240,240,1.0)`)
      .append('svg:title');
  }

  render() {
    return html`<div id="chart"></div>`;
  }
}

customElements.define('log-chart', LogChart);
