import { backendAddress } from './env';

export function getUserAuth() {
  return fetch(`${backendAddress}/api/userStatus`, {
    method: 'GET',
    credentials: 'include',
  })
    .then((response) => response.json())
    .then((data) => data);
}
