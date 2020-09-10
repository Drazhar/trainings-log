export function displayLoginForm() {
  document.removeEventListener('open-login-form', displayLoginForm);
  let loginForm = document.createElement('login-form');
  document.querySelector('main').appendChild(loginForm);
  document.addEventListener('close-login-form', closeLoginForm);
}

export function closeLoginForm() {
  document.removeEventListener('close-login-form', closeLoginForm);
  document.querySelector('login-form').remove();
  document.addEventListener('open-login-form', displayLoginForm);
}
