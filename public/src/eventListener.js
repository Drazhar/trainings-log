const main = document.querySelector('main');

document.addEventListener('open-login-form', () => {
  let loginForm = document.createElement('login-form');
  main.appendChild(loginForm);
});
