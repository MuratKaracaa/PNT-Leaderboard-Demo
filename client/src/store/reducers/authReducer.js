import { authTypes } from "../types";

const initialState = {
  authStatus: false,
  userName: null,
  userToken: null,
};

// Basic state changes for store actions

const authReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case authTypes.START_LOGIN:
      return {
        ...state,
        userName: payload.userName,
      };
    case authTypes.END_LOGIN:
      return {
        ...state,
        authStatus: payload.status,
        userToken: payload.token,
      };
    case authTypes.LOG_OUT:
      return {
        ...state,
        authStatus: false,
        userName: null,
        userToken: null,
      };
    default:
      return state;
  }
};

export default authReducer;
