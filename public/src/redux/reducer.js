import { UPDATE_USER_AUTHENTICATED } from './actions';

const INITIAL_STATE = {
  isUserAuthenticated: false,
  userEmail: '',
};

export function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case UPDATE_USER_AUTHENTICATED:
      return Object.assign({}, state, {
        isUserAuthenticated: action.isUserAuthenticated.isUserAuth,
        userEmail: action.isUserAuthenticated.email,
      });
    default:
      return state;
  }
}
