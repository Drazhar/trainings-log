const avatarComp = document.getElementById('avatar');
const main = document.querySelector('main');

avatarComp.addEventListener('open-login-form', () => {
  let loginForm = document.createElement('login-form');
  main.appendChild(loginForm);
});
