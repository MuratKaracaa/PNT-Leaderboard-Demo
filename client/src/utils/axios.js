// Axios instance to avoid, base url typos

import axios from "axios";

const baseURL = `${process.env.REACT_APP_TARGET_DOMAIN}:${process.env.REACT_APP_TARGET_PORT}/api`;

const instance = axios.create({
  baseURL,
  timeout: 5000,
});

export const post = (url, data) => {
  return instance.post(url, data);
};
