import { LitElement, html } from 'lit-element';
import { connect } from 'pwa-helpers';
import { store } from '../src/redux/store';

class WeightView extends connect(store)(LitElement) {
  render() {
    return html`
      <div class="view-wrapper">
        <div class="view-header">
          <p>blabla</p>
          <login-icon id="avatar"></login-icon>
        </div>
        <div class="view-main">
          MainLorem ipsum dolor sit amet consectetur adipisicing elit. Omnis
          inventore voluptatem accusantium dolores magnam voluptatibus, vel nisi
          molestiae adipisci blanditiis similique tenetur expedita optio alias
          aperiam. Quasi ratione distinctio minima.Lorem ipsum dolor sit amet
          consectetur adipisicing elit. Omnis inventore voluptatem accusantium
          dolores magnam voluptatibus, vel nisi molestiae adipisci blanditiis
          similique tenetur expedita optio alias aperiam. Quasi ratione
          distinctio minima.Lorem ipsum dolor sit amet consectetur adipisicing
          elit. Omnis inventore voluptatem accusantium dolores magnam
          voluptatibus, vel nisi molestiae adipisci blanditiis similique tenetur
          expedita optio alias aperiam. Quasi ratione distinctio minima.Lorem
          ipsum dolor sit amet consectetur adipisicing elit. Omnis inventore
          voluptatem accusantium dolores magnam voluptatibus, vel nisi molestiae
          adipisci blanditiis similique tenetur expedita optio alias aperiam.
          Quasi ratione distinctio minima.Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Omnis inventore voluptatem accusantium dolores
          magnam voluptatibus, vel nisi molestiae adipisci blanditiis similique
          tenetur expedita optio alias aperiam. Quasi ratione distinctio
          minima.Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis
          inventore voluptatem accusantium dolores magnam voluptatibus, vel nisi
          molestiae adipisci blanditiis similique tenetur expedita optio alias
          aperiam. Quasi ratione distinctio minima.Lorem ipsum dolor sit amet
          consectetur adipisicing elit. Omnis inventore voluptatem accusantium
          dolores magnam voluptatibus, vel nisi molestiae adipisci blanditiis
          similique tenetur expedita optio alias aperiam. Quasi ratione
          distinctio minima.Lorem ipsum dolor sit amet consectetur adipisicing
          elit. Omnis inventore voluptatem accusantium dolores magnam
          voluptatibus, vel nisi molestiae adipisci blanditiis similique tenetur
          expedita optio alias aperiam. Quasi ratione distinctio minima.Lorem
          ipsum dolor sit amet consectetur adipisicing elit. Omnis inventore
          voluptatem accusantium dolores magnam voluptatibus, vel nisi molestiae
          adipisci blanditiis similique tenetur expedita optio alias aperiam.
          Quasi ratione distinctio minima.Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Omnis inventore voluptatem accusantium dolores
          magnam voluptatibus, vel nisi molestiae adipisci blanditiis similique
          tenetur expedita optio alias aperiam. Quasi ratione distinctio
          minima.Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis
          inventore voluptatem accusantium dolores magnam voluptatibus, vel nisi
          molestiae adipisci blanditiis similique tenetur expedita optio alias
          aperiam. Quasi ratione distinctio minima.Lorem ipsum dolor sit amet
          consectetur adipisicing elit. Omnis inventore voluptatem accusantium
          dolores magnam voluptatibus, vel nisi molestiae adipisci blanditiis
          similique tenetur expedita optio alias aperiam. Quasi ratione
          distinctio minima.Lorem ipsum dolor sit amet consectetur adipisicing
          elit. Omnis inventore voluptatem accusantium dolores magnam
          voluptatibus, vel nisi molestiae adipisci blanditiis similique tenetur
          expedita optio alias aperiam. Quasi ratione distinctio minima.Lorem
          ipsum dolor sit amet consectetur adipisicing elit. Omnis inventore
          voluptatem accusantium dolores magnam voluptatibus, vel nisi molestiae
          adipisci blanditiis similique tenetur expedita optio alias aperiam.
          Quasi ratione distinctio minima.Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Omnis inventore voluptatem accusantium dolores
          magnam voluptatibus, vel nisi molestiae adipisci blanditiis similique
          tenetur expedita optio alias aperiam. Quasi ratione distinctio
          minima.Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis
          inventore voluptatem accusantium dolores magnam voluptatibus, vel nisi
          molestiae adipisci blanditiis similique tenetur expedita optio alias
          aperiam. Quasi ratione distinctio minima.Lorem ipsum dolor sit amet
          consectetur adipisicing elit. Omnis inventore voluptatem accusantium
          dolores magnam voluptatibus, vel nisi molestiae adipisci blanditiis
          similique tenetur expedita optio alias aperiam. Quasi ratione
          distinctio minima.Lorem ipsum dolor sit amet consectetur adipisicing
          elit. Omnis inventore voluptatem accusantium dolores magnam
          voluptatibus, vel nisi molestiae adipisci blanditiis similique tenetur
          expedita optio alias aperiam. Quasi ratione distinctio minima.Lorem
          ipsum dolor sit amet consectetur adipisicing elit. Omnis inventore
          voluptatem accusantium dolores magnam voluptatibus, vel nisi molestiae
          adipisci blanditiis similique tenetur expedita optio alias aperiam.
          Quasi ratione distinctio minima.Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Omnis inventore voluptatem accusantium dolores
          magnam voluptatibus, vel nisi molestiae adipisci blanditiis similique
          tenetur expedita optio alias aperiam. Quasi ratione distinctio
          minima.Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis
          inventore voluptatem accusantium dolores magnam voluptatibus, vel nisi
          molestiae adipisci blanditiis similique tenetur expedita optio alias
          aperiam. Quasi ratione distinctio minima.Lorem ipsum dolor sit amet
          consectetur adipisicing elit. Omnis inventore voluptatem accusantium
          dolores magnam voluptatibus, vel nisi molestiae adipisci blanditiis
          similique tenetur expedita optio alias aperiam. Quasi ratione
          distinctio minima.
        </div>
      </div>
    `;
  }
  createRenderRoot() {
    return this;
  }
}

customElements.define('weight-view', WeightView);
