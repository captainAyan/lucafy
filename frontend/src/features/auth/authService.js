import axios from "axios";

import {
  REGISTER_URL,
  LOGIN_URL,
  EDIT_PROFILE_URL,
  DELETE_PROFILE_URL,
  GET_PROFILE_URL,
} from "../../constants/api";
import authConfig from "../../util/authConfig";

// Register user
const register = async (userData) => {
  const response = await axios.post(REGISTER_URL, userData);

  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }

  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await axios.post(LOGIN_URL, userData);

  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }

  return response.data;
};

// edit profile
const edit = async (userData, token) => {
  const response = await axios.put(
    EDIT_PROFILE_URL,
    userData,
    authConfig(token)
  );

  if (response.data) {
    localStorage.setItem(
      "user",
      JSON.stringify({
        ...JSON.parse(localStorage.getItem("user")),
        ...response.data,
      })
    );
  }

  return response.data;
};

// get profile and update local-storage (syncing user)
const get = async (token) => {
  const response = await axios.get(GET_PROFILE_URL, authConfig(token));

  if (response.data) {
    localStorage.setItem(
      "user",
      JSON.stringify({
        ...JSON.parse(localStorage.getItem("user")),
        ...response.data,
      })
    );
  }

  return response.data;
};

// delete profile
const deleteAccount = async (token) => {
  const response = await axios.delete(DELETE_PROFILE_URL, authConfig(token));

  if (response.data) {
    localStorage.removeItem("user");
  }

  return response.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem("user");
};

const authService = {
  register,
  logout,
  login,
  deleteAccount,
  edit,
  get,
};

export default authService;
