export default function users(state = {}, action) {
  switch (action.type) {
    case 'CHANGE_PASSWORD_REQUEST':
      return Object.assign({}, state, {
        requestingPasswordChange: true,
        passwordChangeError: null,
        passwordChangeSuccessful: false,
      });
    case 'CHANGE_PASSWORD_SUCCESS':
      return Object.assign({}, state, {
        requestingPasswordChange: false,
        passwordChangeError: null,
        passwordChangeSuccessful: true,
      });
    case 'CHANGE_PASSWORD_FAILURE':
      return Object.assign({}, state, {
        requestingPasswordChange: false,
        passwordChangeError: action.err,
        passwordChangeSuccessful: false,
      });
    case 'SIGN_UP_USER_REQUEST':
      return Object.assign({}, state, {
        requestingUserSignUp: true,
        userSignUpError: null,
        userSignUpSuccessful: false,
      });
    case 'SIGN_UP_USER_SUCCESS':
      return Object.assign({}, state, {
        requestingUserSignUp: false,
        userSignUpError: null,
        userSignUpSuccessful: true,
      });
    case 'SIGN_UP_USER_FAILURE':
      return Object.assign({}, state, {
        requestingUserSignUp: false,
        userSignUpError: action.err,
        userSignUpSuccessful: false,
      });
    default:
      return Object.assign({}, state);
  }
}
