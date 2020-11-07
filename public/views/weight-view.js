import { LitElement, html } from 'lit-element';
import { connect } from 'pwa-helpers';
import { store } from '../src/redux/store';
import { getTodayDate, getSqlDate } from '../../routes/api_helper/utilities';
import { getWeightData, addWeight, removeWeight } from '../src/redux/actions';
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
import { increase, decrease } from '../src/increase_decrease';
import { linearRegression } from 'simple-statistics';

class WeightView extends connect(store)(LitElement) {
  static get properties() {
    return {
      weightData: { type: Array },
      movingAverage: { type: Array },
      weightRate: { type: Array },
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this._updateWeight();
    this.chartCreated = false;
  }

  _updateWeight() {
    let range = document.getElementById('weightRange');

    if (range === null) {
      range = 1;
    } else {
      range = parseInt(range.value);
    }

    getWeightData();
  }

  _handleSubmit(e) {
    e.preventDefault();

    const inputForm = document.getElementsByClassName('input-weight');
    const weight = parseFloat(inputForm[0].querySelector('#weight').value);
    const log_date = inputForm[0].querySelector('#date').value;

    if (!weight) {
      console.log('Please input a number.');
      return;
    } else if (weight < 0) {
      console.log('You have a negative weight?');
      return;
    }

    if (log_date.length > 12) {
      console.log(
        "That's a kinda long date. Please make sure to enter a correct date."
      );
    }

    addWeight({ log_date, weight });
    document.getElementById('weight').value = '';
  }

  stateChanged(state) {
    if (this.weightData !== state.weightData) {
      this.weightData = state.weightData;
      this.movingAverage = getMovingAverage(this.weightData, 15);
      this.weightRate = this._getDataForWeightRegression(this.weightData, 7);

      // Sometimes the state is changed before the view is connected...
      try {
        this._updateDefaultWeight();
      } catch {}
    }
  }

  _getDataForWeightRegression(weightData, days) {
    let weightDataEnd = weightData.length - 1;
    if (weightDataEnd > 1) {
      const latestTime = weightData[weightDataEnd].log_date.getTime();
      let output = [
        [latestTime, weightData[weightDataEnd].weight],
        [
          weightData[weightDataEnd - 1].log_date.getTime(),
          weightData[weightDataEnd - 1].weight,
        ],
      ];
      for (let i = weightDataEnd - 2; i >= 0; i--) {
        const currentTime = weightData[i].log_date.getTime();
        if (currentTime > latestTime - days * 86400000) {
          output.push([currentTime, weightData[i].weight]);
        } else {
          break;
        }
      }

      return linearRegression(output).m * 86400000 * days;
    }
    return 'na';
  }

  _handleRemove(e) {
    removeWeight(e.target.id.split('_')[1]);
  }

  _updateDefaultWeight() {
    if (this.weightData.length > 0) {
      console.log(document.getElementById('date'));
      const currentDate = new Date(document.getElementById('date').value);
      for (let i = this.weightData.length - 1; i > 0; i--) {
        if (currentDate.getTime() >= this.weightData[i].log_date.getTime()) {
          document.getElementById('weight').value = this.weightData[i].weight;
          break;
        }
      }
    }
  }

  render() {
    const currentTrend = this.movingAverage[this.movingAverage.length - 1]
      .weight;
    const latestWeight = this.weightData[this.weightData.length - 1].weight;
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
            <!-- <label for="date">Date </label> -->
            <input
              type="date"
              id="date"
              value="${getTodayDate()}"
              @change="${this._updateDefaultWeight}"
              isRequired
            />
            <!-- <label for="weight">Weight</label> -->
            <input type="number" id="weight" min="0" step="0.1" isRequired />
            <div class="woIncDecBut" for="weight" @click="${increase}">+</div>
            <div class="woIncDecBut" for="weight" @click="${decrease}">-</div>
            <input type="submit" value="Add" @click="${this._handleSubmit}" />
          </form>
          <div id="weight-info-zone">
            <table style="width: 100%">
              <colgroup>
                <col span="1" style="width: 20%;" />
                <col span="1" style="width: 30%;" />
                <col span="1" style="width: 20%;" />
                <col span="1" style="width: 30%;" />
              </colgroup>
              <tr>
                <td>Latest</td>
                <td>${latestWeight.toFixed(1)} kg</td>
                <td>Trend</td>
                <td>${currentTrend.toFixed(1)} kg</td>
              </tr>
              <tr>
                <td>BMI</td>
                <td>${(latestWeight / 1.78 ** 2).toFixed(1)}</td>
                <td></td>
                <td>${(currentTrend / 1.78 ** 2).toFixed(1)}</td>
              </tr>
              <tr>
                <td>Rate</td>
                <td colspan="3">
                  ${this.weightRate.toFixed(1)} kg/week
                  (~${Math.round(this.weightRate * 1000)} kcal/day)
                </td>
              </tr>
            </table>
          </div>
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
    const env = this.getChartParameters();
    if (!this.chartCreated) {
      this.createChart(env);
      this.chartCreated = true;
      try {
        this._updateDefaultWeight();
      } catch {}
    } else {
      this.updateChart(env);
    }
  }

  getChartParameters() {
    let env = {};
    env.chartArea = document.getElementById('weight-chart');

    env.margin = { top: 15, right: 20, bottom: 20, left: 20 };
    env.width = env.chartArea.clientWidth - env.margin.left - env.margin.right;
    env.height = 300 - env.margin.top - env.margin.bottom;

    env.lastDate = new Date();
    const tickCount = 20;
    const tickCountShow = tickCount - 5;
    const diffToday = Math.floor((new Date() - env.lastDate) / 86400000);

    // DEFINE AXIS
    env.x = scalePow()
      .exponent(0.5)
      .range([0, env.width])
      .domain([
        -365,
        max(this.weightData, (d) => (d.log_date - env.lastDate) / 86400000) +
          14,
      ]);

    let yMax = Math.ceil(max(this.weightData, (d) => d.weight));
    yMax = Math.ceil(yMax * 1.01);
    let yMin = Math.floor(min(this.weightData, (d) => d.weight));
    if (yMin < 0) {
      yMin = 0;
    } else {
      yMin = Math.floor(yMin * 0.99);
    }
    env.y = scaleLinear().range([env.height, 0]).domain([yMin, yMax]);

    // DEFINE AXIS SETTINGS
    env.xAxisSettings = axisBottom(env.x)
      .ticks(tickCount)
      .tickSize(-env.height)
      .tickFormat((d, i) => {
        if (i >= tickCountShow) {
          return d - diffToday;
        } else if (i % 4 === 0) {
          return d - diffToday;
        }
      });

    env.yAxisSettings = axisLeft(env.y).ticks(4).tickSize(-env.width);

    // DEFINE LINE
    env.lineSmooth = line()
      .x((d) => env.x((d.log_date - env.lastDate) / 86400000))
      .y((d) => env.y(d.weight))
      .curve(curveBasis);

    env.dotXFunction = (d) => {
      return env.x((d.log_date - env.lastDate) / 86400000);
    };

    // GENERATE ARRAY FOR THE FORECAST
    const recentMovingAvg = this.movingAverage[this.movingAverage.length - 1];
    env.forecastData = [];
    for (let i = 0; i <= 24; i += 0.5) {
      env.forecastData.push([
        (recentMovingAvg.log_date - env.lastDate) / 86400000 + i,
        (this.weightRate / 7) * i + recentMovingAvg.weight,
      ]);
    }

    return env;
  }

  createChart(env) {
    // Create the chart itself
    this.svg = select(env.chartArea)
      .append('svg')
      .attr('width', env.width + env.margin.left + env.margin.right)
      .attr('height', env.height + env.margin.top + env.margin.bottom)
      .append('g')
      .attr('transform', `translate(${env.margin.left},${env.margin.top})`);

    this.svg
      .append('defs')
      .append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('width', env.width)
      .attr('height', env.height);

    // CREATE DOTS
    this.svg
      .selectAll('dot')
      .data(this.weightData)
      .enter()
      .append('circle')
      .attr('r', 2)
      .attr('cx', env.dotXFunction)
      .attr('cy', (d) => env.y(d.weight));

    // CREATE LINE
    this.trendLine = this.svg
      .append('path')
      .attr('clip-path', 'url(#clip)')
      .attr('d', env.lineSmooth(this.movingAverage))
      .attr('stroke', '#29a6c9')
      .attr('stroke-width', 3)
      .attr('fill', 'none')
      .attr('stroke-linejoin', 'round');

    // CREATE FORECAST LINE
    this.forecastLine = this.svg
      .append('path')
      .attr('clip-path', 'url(#clip)')
      .attr(
        'd',
        line()
          .x((d) => env.x(d[0]))
          .y((d) => env.y(d[1]))(env.forecastData)
      )
      .attr('stroke', 'rgba(41,166,201,0.2)')
      .attr('stroke-width', 3)
      .attr('fill', 'none')
      .attr('stroke-linejoin', 'round');

    // CREATE AXIS
    this.xAxis = this.svg
      .append('g')
      .attr('transform', `translate(0,${env.height})`)
      .call(env.xAxisSettings)
      .attr('color', 'lightgrey');

    this.yAxis = this.svg
      .append('g')
      .call(env.yAxisSettings)
      .attr('color', 'lightgrey');
  }

  updateChart(env) {
    const transitionTime = 400;

    // UPDATE DOTS
    const dots = this.svg.selectAll('circle').data(this.weightData);
    dots // Update position of old circles if axis changes
      .transition()
      .duration(transitionTime)
      .attr('cx', env.dotXFunction)
      .attr('cy', (d) => env.y(d.weight));

    dots.exit().transition().duration(transitionTime).attr('r', 0).remove();
    dots
      .enter()
      .append('circle')
      .attr('r', 0)
      .attr('cx', env.dotXFunction)
      .attr('cy', (d) => env.y(d.weight))
      .transition()
      .duration(transitionTime)
      .attr('r', 2);

    // UPDATE LINE
    this.trendLine
      .transition()
      .duration(transitionTime)
      .attr('d', env.lineSmooth(this.movingAverage));

    // UPDATE FORECAST LINE
    this.forecastLine
      .transition()
      .duration(transitionTime)
      .attr(
        'd',
        line()
          .x((d) => env.x(d[0]))
          .y((d) => env.y(d[1]))(env.forecastData)
      );

    // UPDATE AXIS
    this.xAxis.transition().duration(transitionTime).call(env.xAxisSettings);
    this.yAxis.transition().duration(transitionTime).call(env.yAxisSettings);
  }

  createRenderRoot() {
    return this;
  }
}

customElements.define('weight-view', WeightView);
