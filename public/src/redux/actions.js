import { store } from './store';
import { backendAddress } from '../env';

export const UPDATE_USER_AUTHENTICATED = 'UPDATE_USER_AUTHENTICATED';

export const GET_WEIGHT_DATA = 'GET_WEIGHT_DATA';

export const SET_EXERCISES = 'SET_EXERCISES';
export const REMOVE_EXERCISE = 'REMOVE_EXERCISE';

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

export function updateExercise(exerciseData) {
  store.dispatch({ type: SET_EXERCISES, exerciseData });
}

export function removeExercise(exerciseId) {
  store.dispatch({ type: REMOVE_EXERCISE, exerciseId });
}

export function getExercises() {
  let fetchURL = `${backendAddress}/api/getExercises`;

  fetch(fetchURL, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((exercises) => {
      let exerciseData = {};
      exercises.forEach((item) => {
        exerciseData[item.id] = {
          name: item.name,
          color: item.color,
          description: item.description,
          logs: item.logs,
        };
      });
      store.dispatch({ type: SET_EXERCISES, exerciseData });
    });
}
