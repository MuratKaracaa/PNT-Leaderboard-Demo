import { call, put, takeLatest } from "redux-saga/effects";
import { authActions } from "../actions";
import { authTypes } from "../types";
import { authService } from "../../services";
import { localstorage } from "../../utils";

// Response from the server is stored in state and token is saved in localstorage

function* logIn({ payload }) {
  const { userName } = payload;
  try {
    const { data } = yield call(authService.login, { userName });
    yield put(authActions.endLogin({ status: true, token: data.token }));

    localstorage.setItem("authData", data);
  } catch (error) {
    console.log("ERRRRRRRRR", error);
  }
}

const authSagas = [takeLatest(authTypes.START_LOGIN, logIn)];

export default authSagas;
