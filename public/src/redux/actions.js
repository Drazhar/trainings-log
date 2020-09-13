import { store } from './store';

export const UPDATE_USER_AUTHENTICATED = 'UPDATE_USER_AUTHENTICATED';
export const GET_WEIGHT_DATA = 'GET_WEIGHT_DATA';

export function updateUserAuthenticated(isUserAuthenticated) {
  return {
    type: UPDATE_USER_AUTHENTICATED,
    isUserAuthenticated,
  };
}

export function getWeightData(fromDate, toDate) {
  // GET weight from Database
  fetch('http://localhost:3000/api/getWeight', {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((weightData) => {
      weightData.forEach((item, index) => {
        weightData[index].date = new Date(item.date);
      });

      store.dispatch({ type: GET_WEIGHT_DATA, weightData });
    });
}
