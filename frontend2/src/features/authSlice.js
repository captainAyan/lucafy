import { createSlice } from "@reduxjs/toolkit";

const token = localStorage.getItem("token");

const initialState = {
  user: null,
  token: token ? token : null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      const { token, ...user } = action.payload;
      state = { user, token };
      return state;
    },
    register: (state, action) => {
      const { token, ...user } = action.payload;
      state = { user, token };
      return state;
    },
    logout: (state) => {
      state = { user: null, token: null };
      return state;
    },
    updateUser: (state, action) => {
      state = { user: action.payload, token: state.token };
      return state;
    },
  },
});

export const { login, register, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
