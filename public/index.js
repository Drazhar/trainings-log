import './style.scss';
import './src/eventListener/loginForm';
import './components/loginIcon';
import './components/loginForm';

document.dispatchEvent(new CustomEvent('open-login-form', {}));
