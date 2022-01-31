import { axios } from "../utils";

// basic login function, using the axios instance created
export const login = async (credentials) => {
  const { userName } = credentials;
  return await axios.post("/auth/login", { userName });
};
