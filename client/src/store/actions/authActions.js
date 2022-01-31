import { authTypes } from "../types";

// Basic store actions
export const startLogin = (credentials) => {
  return {
    type: authTypes.START_LOGIN,
    payload: credentials,
  };
};

export const endLogin = (authData) => {
  return {
    type: authTypes.END_LOGIN,
    payload: authData,
  };
};

export const logOut = () => {
  return {
    type: authTypes.LOG_OUT,
  };
};
