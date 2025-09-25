export const API_ENDPOINTS = {
  AUTH: {
    GET_ME: "auth/user",
    SIGN_UP_WITH_EMAIL: "auth/email/register",
    SIGN_IN_WITH_EMAIL: "auth/email/login",
    RESET_PASSWORD_REQUEST: "auth/password/reset-request",
    VERIFY_RESET_CODE: "auth/password/verify-code",
    RESET_PASSWORD: "auth/password/reset",
    COMPLETE_REGISTRATION: "user/complete-registration",
  },
  USER: {
    COMPLETE_REGISTRATION: "user/complete-registration",
    GET_CITIES: "user/cities",
  },
};
