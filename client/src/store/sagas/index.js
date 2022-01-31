import { all } from "redux-saga/effects";

import authSagas from "./authSagas.js";

export { authSagas };

export default function* rootSaga() {
  yield all([...authSagas]);
}
