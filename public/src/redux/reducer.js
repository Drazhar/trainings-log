import {
  UPDATE_USER_AUTHENTICATED,
  ADD_WEIGHT,
  GET_WEIGHT_DATA,
  SET_EXERCISES,
  REMOVE_EXERCISE,
  SET_WORKOUTS,
  DELETE_WORKOUT,
  REMOVE_WEIGHT,
  SET_EX_WO_DATA,
} from './actions';
import { reorderWorkouts } from './utilities/reorderWorkouts';

const INITIAL_STATE = {
  isUserAuthenticated: false,
  userID: '',
  weightData: [],
  exercises: {},
  workouts: {},
};

export function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case UPDATE_USER_AUTHENTICATED:
      return Object.assign({}, state, {
        isUserAuthenticated: action.isUserAuthenticated.isUserAuth,
        userID: action.isUserAuthenticated.userID,
      });
    case ADD_WEIGHT:
      let newWeightData = [...state.weightData];
      for (let i = newWeightData.length - 1; i >= 0; i--) {
        if (action.weightObject.log_date > newWeightData[i].log_date) {
          newWeightData.splice(i + 1, 0, action.weightObject);
          break;
        }
      }
      return Object.assign({}, state, {
        weightData: newWeightData,
      });
    case REMOVE_WEIGHT:
      let newWeightDataRemove = [...state.weightData];
      for (let i = newWeightDataRemove.length - 1; i >= 0; i--) {
        const timeA = newWeightDataRemove[i].log_date.getTime();
        const timeB = action.log_date.getTime();
        if (timeA >= timeB - 28800000 || timeA <= timeB + 28800000) {
          newWeightDataRemove.splice(i, 1);
          break;
        }
      }
      return Object.assign({}, state, {
        weightData: newWeightDataRemove,
      });
    case GET_WEIGHT_DATA:
      return Object.assign({}, state, {
        weightData: action.weightData,
      });
    case SET_EXERCISES:
      let setExerciseObject = Object.assign(
        {},
        state.exercises,
        action.exerciseData
      );

      return Object.assign({}, state, {
        exercises: setExerciseObject,
        exerciseOrder: getExerciseOrder(setExerciseObject),
      });
    case REMOVE_EXERCISE:
      let result = Object.assign({}, state, {
        exercises: Object.assign({}, state.exercises),
      });
      delete result.exercises[action.exerciseId];
      for (let i = 0; i < state.exerciseOrder.length; i++) {
        if (state.exerciseOrder[i][0] == action.exerciseId) {
          result.exerciseOrder.splice(i, 1); // Not nice but easy :-/
          break;
        }
      }
      return result;
    case SET_WORKOUTS:
      let currentWorkoutStore = Object.assign(
        {},
        action.workoutData,
        state.workouts
      );

      const workoutOrder = Object.keys(currentWorkoutStore);
      if (
        currentWorkoutStore[workoutOrder[0]].date.getTime() <
        currentWorkoutStore[workoutOrder[1]].date.getTime()
      ) {
        currentWorkoutStore = reorderWorkouts(currentWorkoutStore);
      }

      return Object.assign({}, state, {
        workouts: currentWorkoutStore,
      });
    case DELETE_WORKOUT:
      let resultRemWo = Object.assign({}, state, {
        workouts: Object.assign({}, state.workouts),
      });
      delete resultRemWo.workouts[action.workoutId];
      return resultRemWo;
    case SET_EX_WO_DATA:
      return Object.assign({}, state, {
        exerciseWoData: action.exerciseWoData,
      });
    default:
      return state;
  }
}

function getExerciseOrder(exercises) {
  let result = [];
  Object.keys(exercises).forEach((key) => {
    result.push([key, exercises[key].lastUsed, exercises[key].count]);
  });
  result.sort((a, b) => {
    for (let i = 1; i < a.length; i++) {
      if (a[i] < b[i]) {
        return 1;
      } else if (a[i] > b[i]) {
        return -1;
      }
    }
    return 0;
  });
  return result;
}
