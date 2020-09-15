import { store } from './store';
import { backendAddress } from '../env';

export const UPDATE_USER_AUTHENTICATED = 'UPDATE_USER_AUTHENTICATED';

export const GET_WEIGHT_DATA = 'GET_WEIGHT_DATA';

export const ADD_EXERCISE = 'ADD_EXERCISE';

export function updateUserAuthenticated(isUserAuthenticated) {
  return {
    type: UPDATE_USER_AUTHENTICATED,
    isUserAuthenticated,
  };
}

export function getWeightData(fromDate, toDate) {
  let fetchURL = `${backendAddress}/api/getWeight`;
  if (fromDate || toDate) {
    fetchURL += '?';
  }
  if (fromDate) {
    fetchURL += `fromDate=${fromDate}`;
    if (toDate) {
      fetchURL += '&';
    }
  }
  if (toDate) {
    fetchURL += `toDate=${toDate}`;
  }

  fetch(fetchURL, {
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
