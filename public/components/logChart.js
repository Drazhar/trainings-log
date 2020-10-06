import { LitElement, html, css } from 'lit-element';
import { connect } from 'pwa-helpers';
import { store } from '../src/redux/store';
import { getSqlDate } from '../../routes/api_helper/utilities';
import {
  select,
  curveLinear,
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
      color: { type: String },
    };
  }

  firstUpdated() {
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

    const lastDate = new Date(this.chartData[0][0]);
    const diffToday = Math.floor((new Date() - lastDate) / 86400000);
    const x = scalePow()
      .exponent(0.6)
      .range([0, width])
      .domain([
        min(this.chartData, (d) => (d[0] - lastDate) / 86400000),
        max(this.chartData, (d) => (d[0] - lastDate) / 86400000),
      ]);
    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(
        axisBottom(x)
          .ticks(3)
          .tickFormat((d) => {
            return d - diffToday;
          })
      )
      .attr('color', 'RGBA(240,240,240,0.4)');

    let yMax = Math.ceil(max(this.chartData, (d) => d[1][0] / d[2]));
    yMax = Math.ceil(yMax * 1.05);
    let yMin = Math.floor(min(this.chartData, (d) => d[1][0] / d[2]));
    if (yMin < 0) {
      yMin = 0;
    } else {
      yMin = Math.floor(yMin * 0.95);
    }
    const y = scaleLinear().range([height, 0]).domain([yMin, yMax]);
    svg
      .append('g')
      .call(axisLeft(y).ticks(3))
      .attr('color', 'RGBA(240,240,240,0.4)');

    let lines = [];
    const curveData = getCurveChartData(this.chartData, 0);

    for (let i = 0; i < 1; i++) {
      lines.push(
        line()
          .x((d) => x((d[0] - lastDate) / 86400000))
          .y((d) => {
            return y(d[1][i] / d[2]);
          })
          .curve(curveLinear)
      );

      svg
        .append('path')
        // .attr('clip-path', 'url(#clip)')
        .attr('d', lines[i](curveData))
        .attr('stroke', this.color)
        // .attr('stroke', `rgba(41, 166, 201,${1 - i * 0.4})`)
        .attr('stroke-width', 3 - i)
        .attr('fill', 'none')
        .attr('stroke-linejoin', 'round');
    }

    svg
      .selectAll('dot')
      .data(this.chartData)
      .enter()
      .append('circle')
      .attr('r', 3)
      .attr('cx', (d) => x((d[0] - lastDate) / 86400000))
      .attr('cy', (d) => {
        return y(d[1][0] / d[2]);
      })
      .attr('fill', `RGBA(240,240,240,0.6)`)
      .append('svg:title');
  }

  render() {
    return html`<div id="chart"></div>`;
  }
}

customElements.define('log-chart', LogChart);

function getCurveChartData(chartData, indexToCheck) {
  let result = [];
  for (let i = 0; i < chartData.length; i++) {
    if (i === chartData.length - 1) {
      result.push(chartData[i]);
    }
    for (let j = i + 1; j < chartData.length; j++) {
      if (getSqlDate(chartData[i][0]) == getSqlDate(chartData[j][0])) {
      } else if (j === i + 1) {
        result.push(chartData[i]);
        break;
      } else {
        let max = chartData[i][1][indexToCheck] / chartData[i][2];
        let toPush = i;
        for (let k = i + 1; k < j; k++) {
          if (chartData[k][1][indexToCheck] / chartData[k][2] > max) {
            max = chartData[k][i][indexToCheck] / chartData[k][2];
            toPush = k;
          }
        }
        result.push(chartData[toPush]);
        i = j - 1;
        break;
      }
    }
  }
  return result;
}
