import { UPDATE_USER_AUTHENTICATED, GET_WEIGHT_DATA } from './actions';

const INITIAL_STATE = {
  isUserAuthenticated: false,
  userID: '',
  weightData: [],
  exercises: [],
};

export function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case UPDATE_USER_AUTHENTICATED:
      return Object.assign({}, state, {
        isUserAuthenticated: action.isUserAuthenticated.isUserAuth,
        userID: action.isUserAuthenticated.userID,
      });
    case GET_WEIGHT_DATA:
      return Object.assign({}, state, {
        weightData: action.weightData,
      });
    default:
      return state;
  }
}
