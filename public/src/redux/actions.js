export const UPDATE_USER_AUTHENTICATED = 'UPDATE_USER_AUTHENTICATED';

export function updateUserAuthenticated(isUserAuthenticated) {
  return {
    type: UPDATE_USER_AUTHENTICATED,
    isUserAuthenticated,
  };
}
