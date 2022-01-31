import authReducer from "./authReducer";
import dataReducer from "./dataReducer";
import { combineReducers } from "redux";

export default combineReducers({ authReducer, dataReducer });
