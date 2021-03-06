import { store } from './store';
import { backendAddress } from '../env';

export const UPDATE_USER_AUTHENTICATED = 'UPDATE_USER_AUTHENTICATED';

export const ADD_WEIGHT = 'ADD_WEIGHT';
export const REMOVE_WEIGHT = 'REMOVE_WEIGHT';
export const GET_WEIGHT_DATA = 'GET_WEIGHT_DATA';

export const SET_EXERCISES = 'SET_EXERCISES';
export const REMOVE_EXERCISE = 'REMOVE_EXERCISE';

export const SET_WORKOUTS = 'SET_WORKOUTS';
export const DELETE_WORKOUT = 'DELETE_WORKOUT';

export const SET_EX_WO_DATA = 'SET_EX_WO_DATA';

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
        weightData[index].log_date = new Date(item.log_date);
        weightData[index].weight = parseFloat(weightData[index].weight);
      });
      store.dispatch({ type: GET_WEIGHT_DATA, weightData });
    });
}

export function addWeight(weightObject) {
  fetch(`${backendAddress}/api/addWeight`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(weightObject),
  });

  store.dispatch({
    type: ADD_WEIGHT,
    weightObject: {
      log_date: new Date(weightObject.log_date),
      weight: parseFloat(weightObject.weight),
    },
  });
}

export function removeWeight(log_date) {
  fetch(`${backendAddress}/api/removeWeight`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ log_date }),
  });

  store.dispatch({
    type: REMOVE_WEIGHT,
    log_date: new Date(log_date),
  });
}

export function getTrainingData() {
  let fetchURL = `${backendAddress}/api/getTraining`;

  return fetch(fetchURL, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      Object.keys(data.workouts).forEach((key) => {
        data.workouts[key].date = new Date(data.workouts[key].date);
        data.workouts[key].exercises.forEach((ex, index) => {
          ex.sets.forEach((numberList, nIndex) => {
            numberList.forEach((value, vIndex) => {
              data.workouts[key].exercises[index].sets[nIndex][
                vIndex
              ] = parseInt(value);
            });
          });
        });
      });
      store.dispatch({ type: SET_WORKOUTS, workoutData: data.workouts });

      updateWoDataExLastEntries(data.workouts, data.exercises);
    });
}

export function updateExercise(exerciseData) {
  store.dispatch({ type: SET_EXERCISES, exerciseData });

  // SEND TO BACKEND FOR DATABASE
  fetch(`${backendAddress}/api/editExercise`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(exerciseData),
  });
}

export function removeExercise(exerciseId) {
  store.dispatch({ type: REMOVE_EXERCISE, exerciseId });

  fetch(`${backendAddress}/api/removeExercise`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ exerciseId }),
  });
}

export function updateWorkout(workoutData) {
  store.dispatch({ type: SET_WORKOUTS, workoutData });

  const storeData = store.getState();
  updateWoDataExLastEntries(storeData.workouts, storeData.exercises);

  // SEND TO BACKEND FOR DATABASE
  fetch(`${backendAddress}/api/editWorkout`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(workoutData),
  });
}

export function deleteWorkout(workoutId) {
  store.dispatch({ type: DELETE_WORKOUT, workoutId });

  const storeData = store.getState();
  updateWoDataExLastEntries(storeData.workouts, storeData.exercises);

  fetch(`${backendAddress}/api/removeWorkout`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ workoutId }),
  });
}

function getExerciseWoData(workouts) {
  let result = {};
  let lastEntries = {};

  Object.keys(workouts).forEach((woKey) => {
    const currentWo = workouts[woKey];
    currentWo.exercises.forEach((ex) => {
      if (!(ex.id in result)) {
        result[ex.id] = [];
        lastEntries[ex.id] = ex.sets;
      }
      let sum = new Array(ex.sets[0].length).fill(0);
      let setCount = 0;
      // console.log(ex.sets);
      ex.sets.forEach((set) => {
        set.forEach((value, index) => {
          sum[index] += value;
        });
        setCount++;
      });
      result[ex.id].push([currentWo.date, [...sum], setCount]);
    });
  });

  return [result, lastEntries];
}

function updateWoDataExLastEntries(workoutInputData, exerciseInputData) {
  const resultGetExWoData = getExerciseWoData(workoutInputData);

  store.dispatch({
    type: SET_EX_WO_DATA,
    exerciseWoData: resultGetExWoData[0],
  });

  let exerciseData = {};
  if (exerciseInputData.length) {
    exerciseInputData.forEach((item) => {
      exerciseData[item.id] = {
        name: item.name,
        color: item.color,
        description: item.description,
        logs: item.logs,
        count: parseInt(item.count),
        lastUsed: new Date(item.lastUsed),
        lastEntries: resultGetExWoData[1][item.id],
      };
    });
  } else {
    Object.keys(exerciseInputData).forEach((exId) => {
      exerciseData[exId] = {
        name: exerciseInputData[exId].name,
        color: exerciseInputData[exId].color,
        description: exerciseInputData[exId].description,
        logs: exerciseInputData[exId].logs,
        count: parseInt(exerciseInputData[exId].count),
        lastUsed: new Date(exerciseInputData[exId].lastUsed),
        lastEntries: resultGetExWoData[1][exId],
      };
    });
  }

  store.dispatch({ type: SET_EXERCISES, exerciseData });
}
