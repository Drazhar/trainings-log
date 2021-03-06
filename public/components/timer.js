import { LitElement, html } from 'lit-element';

class workoutTimer extends LitElement {
  static get properties() {
    return {
      startTime: { type: Number },
      minutesPassed: { type: String },
      secondsPassed: { type: String },
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.minutesPassed = '00';
    this.secondsPassed = '00';
  }

  _startTimer(e) {
    e.preventDefault();
    try {
      this._stopTimer(e);
    } catch {}
    this.startTime = new Date().getTime();
    this.minutesPassed = '00';
    this.secondsPassed = '00';

    this.interval = setInterval(() => {
      const timePassed = new Date() - this.startTime;
      const minutesPassed = Math.floor(timePassed / 60000);
      if (minutesPassed < 10) {
        this.minutesPassed = '0' + minutesPassed;
      } else {
        this.minutesPassed = minutesPassed;
      }
      const secondsPassed = Math.round(
        timePassed / 1000 - this.minutesPassed * 60
      );
      if (secondsPassed < 10) {
        this.secondsPassed = '0' + secondsPassed;
      } else {
        this.secondsPassed = secondsPassed;
      }
    }, 1000);
  }

  _stopTimer(e) {
    e.preventDefault();
    clearInterval(this.interval);
  }

  render() {
    return html`
      <div id="timer">
        <p id="clock">${this.minutesPassed} : ${this.secondsPassed}</p>
        <div id="controls">
          <button @click="${this._startTimer}">Start</button>
          <button @click="${this._stopTimer}">Stop</button>
        </div>
      </div>
    `;
  }

  createRenderRoot() {
    return this;
  }
}

customElements.define('workout-timer', workoutTimer);
