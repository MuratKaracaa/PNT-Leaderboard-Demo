//some helper functions to avoid unnecessary JSON.parse / stringify coding

export const setItem = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const getItem = (key) => {
  return JSON.parse(localStorage.getItem(key));
};

export const removeItem = (key) => {
  localStorage.removeItem(key);
};
