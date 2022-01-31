import { dataTypes } from "../types";

const initialState = {
  profileData: null,
  selfRankData: null,
};

// Basic state changes for store actions

const dataReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case dataTypes.GET_PROFILE_DATA:
      return {
        ...state,
        profileData: payload,
      };
    case dataTypes.GET_SELF_RANK_DATA:
      return {
        ...state,
        selfRankData: payload,
      };
    case dataTypes.REMOVE_DATA:
      return {
        ...state,
        profileData: null,
        selfRankData: null,
      };
    default:
      return state;
  }
};

export default dataReducer;
