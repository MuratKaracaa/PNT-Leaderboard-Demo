import { dataTypes } from "../types";

// Basic store actions
export const getProfileData = (profileData) => {
  return {
    type: dataTypes.GET_PROFILE_DATA,
    payload: profileData,
  };
};

export const getSelfRankData = (selfRankData) => {
  return {
    type: dataTypes.GET_SELF_RANK_DATA,
    payload: selfRankData,
  };
};

export const removeData = () => {
  return {
    type: dataTypes.REMOVE_DATA,
  };
};
