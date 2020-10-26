import {
  UPDATE_USER_AUTHENTICATED,
  ADD_WEIGHT,
  GET_WEIGHT_DATA,
  SET_EXERCISES,
  REMOVE_EXERCISE,
  SET_WORKOUTS,
  DELETE_WORKOUT,
  REMOVE_WEIGHT,
} from './actions';

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
        if (
          newWeightDataRemove[i].log_date.getTime() == action.log_date.getTime()
        ) {
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
      return Object.assign({}, state, {
        exercises: Object.assign({}, state.exercises, action.exerciseData),
      });
    case REMOVE_EXERCISE:
      let result = Object.assign({}, state, {
        exercises: Object.assign({}, state.exercises),
      });
      delete result.exercises[action.exerciseId];
      return result;
    case SET_WORKOUTS:
      return Object.assign({}, state, {
        workouts: Object.assign({}, state.workouts, action.workoutData),
      });
    case DELETE_WORKOUT:
      let resultRemWo = Object.assign({}, state, {
        workouts: Object.assign({}, state.workouts),
      });
      delete resultRemWo.workouts[action.workoutId];
      return resultRemWo;
    default:
      return state;
  }
}
