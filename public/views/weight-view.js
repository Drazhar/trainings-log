import { LitElement, html } from 'lit-element';
import { connect } from 'pwa-helpers';
import { store } from '../src/redux/store';
import { getTodayDate, getSqlDate } from '../../routes/api_helper/utilities';
import { getWeightData } from '../src/redux/actions';
import {
  select,
  curveBasis,
  scalePow,
  scaleLinear,
  line,
  axisLeft,
  min,
  max,
  axisBottom,
} from 'd3';
import { getMovingAverage } from '../src/movingAverage';
import { backendAddress } from '../src/env';

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
      getWeightData();
      // getWeightData(getTodayDate(range), getTodayDate());
    }
  }

  _handleSubmit(e) {
    e.preventDefault();

    const inputForm = document.getElementsByClassName('input-weight');
    const weight = inputForm[0].querySelector('#weight').value;
    const date = inputForm[0].querySelector('#date').value;

    fetch(`${backendAddress}/api/addWeight`, {
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
    if (this.weightData !== state.weightData) {
      this.weightData = state.weightData;
      this.movingAverage = getMovingAverage(this.weightData, 5);
    }
  }

  _handleRemove(e) {
    const date = e.target.id.split('_')[1];

    fetch(`${backendAddress}/api/removeWeight`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ date }),
    });
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
            <input type="submit" value="Add" @click="${this._handleSubmit}" />
          </form>
          <table
            id="weightRawData"
            style="color:white; width:99%; margin-top: 1em"
          >
            ${[...this.weightData].reverse().map((entry) => {
              return html`<tr>
                <td>
                  ${entry.log_date.getDate() < 10
                    ? '0' + entry.log_date.getDate()
                    : entry.log_date.getDate()}.${entry.log_date.getMonth() +
                    1 <
                  10
                    ? '0' + (entry.log_date.getMonth() + 1)
                    : entry.log_date.getMonth() +
                      1}.${entry.log_date.getFullYear()}
                </td>
                <td>${entry.weight}</td>
                <td>
                  <button
                    id="rem_${getSqlDate(entry.log_date)}"
                    @click="${this._handleRemove}"
                  >
                    Remove
                  </button>
                </td>
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

    const margin = { top: 15, right: 20, bottom: 20, left: 20 };
    const width = chartArea.clientWidth - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    // Create the chart itself
    const svg = select(chartArea)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X SCALE
    // const x = scaleTime()
    //   .range([0, width])
    //   .domain([
    //     min(this.weightData, (d) => d.date),
    //     max(this.weightData, (d) => d.date),
    //   ]);

    const tickCount = 20;
    const tickCountShow = tickCount - 5;
    // const lastDate = new Date(this.weightData[this.weightData.length -
    // 1].date);
    const lastDate = new Date();
    const diffToday = Math.floor((new Date() - lastDate) / 86400000);
    const x = scalePow()
      .exponent(0.5)
      .range([0, width])
      .domain([
        // min(this.weightData, (d) => (d.date - lastDate) / 86400000),
        -365,
        max(this.weightData, (d) => (d.log_date - lastDate) / 86400000) + 14,
      ]);
    svg
      .append('defs')
      .append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('width', width)
      .attr('height', height);

    // Y SCALE
    let yMax = Math.ceil(max(this.weightData, (d) => d.weight));
    yMax = Math.ceil(yMax * 1.01);
    let yMin = Math.floor(min(this.weightData, (d) => d.weight));
    if (yMin < 0) {
      yMin = 0;
    } else {
      yMin = Math.floor(yMin * 0.99);
    }
    const y = scaleLinear().range([height, 0]).domain([yMin, yMax]);

    // CREATE DOTS
    svg
      .selectAll('dot')
      .data(this.weightData)
      .enter()
      .append('circle')
      .attr('r', 2)
      .attr('cx', (d) => {
        return x((d.log_date - lastDate) / 86400000);
      })
      .attr('cy', (d) => y(d.weight))
      .attr('fill', `RGBA(240,240,240,0.3)`)
      .append('svg:title')
      .text((d, i) => `blabla`);

    // CREATE LINE
    const lineSmooth = line()
      .x((d) => x((d.log_date - lastDate) / 86400000))
      .y((d) => y(d.weight))
      .curve(curveBasis);

    svg
      .append('path')
      .attr('clip-path', 'url(#clip)')
      .attr('d', lineSmooth(this.movingAverage))
      .attr('stroke', '#29a6c9')
      .attr('stroke-width', 3)
      .attr('fill', 'none')
      .attr('stroke-linejoin', 'round');

    // X and Y axis
    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(
        axisBottom(x)
          .ticks(tickCount)
          .tickSize(-height)
          .tickFormat((d, i) => {
            if (i >= tickCountShow) {
              return d - diffToday;
            } else if (i % 4 === 0) {
              return d - diffToday;
            }
          })
      )
      .attr('color', 'lightgrey');

    svg
      .append('g')
      .call(axisLeft(y).ticks(4).tickSize(-width))
      .attr('color', 'lightgrey');
  }

  createRenderRoot() {
    return this;
  }
}

customElements.define('weight-view', WeightView);
