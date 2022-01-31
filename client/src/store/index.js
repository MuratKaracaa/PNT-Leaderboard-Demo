// Redux Store setup, with redux saga for asynchronous operations

import { applyMiddleware, createStore } from "redux";
import createSagaMiddleware from "@redux-saga/core";

import reducers from "./reducers";
import rootSaga from "./sagas";

const sagaMiddleware = createSagaMiddleware();

const middlewares = [sagaMiddleware];

const store = createStore(reducers, applyMiddleware(...middlewares));

sagaMiddleware.run(rootSaga);

export default store;
