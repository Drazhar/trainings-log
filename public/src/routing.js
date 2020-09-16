import { Router } from '@vaadin/router';
import '../views/log-view';

window.addEventListener('load', () => {
  initRouter();
});

function initRouter() {
  const router = new Router(document.querySelector('main'));
  router.setRoutes([
    {
      path: '/',
      component: 'log-view',
      action: () => {
        activeMenuItem('log');
      },
    },
    {
      path: '/exercise',
      component: 'exercise-view',
      action: () => {
        import('../views/exercise-view');
        activeMenuItem('exercise');
      },
    },
    {
      path: '/weight',
      component: 'weight-view',
      action: () => {
        import('../views/weight-view');
        activeMenuItem('weight');
      },
    },
    {
      path: '(.*)',
      component: 'log-view',
      action: () => {
        activeMenuItem('log');
      },
    },
  ]);
}

function activeMenuItem(itemId) {
  var btns = document.getElementsByClassName('nav-button');

  for (var i = 0; i < btns.length; i++) {
    if (btns[i].id === itemId) {
      btns[i].className += ' nav-active';
    } else {
      btns[i].className = 'nav-button';
    }
  }
}
