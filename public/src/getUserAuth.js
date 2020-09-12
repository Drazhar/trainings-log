export function getUserAuth() {
  return fetch('http://localhost:3000/api/userStatus', {
    method: 'GET',
    credentials: 'include',
  })
    .then((response) => response.json())
    .then((data) => data);
}
