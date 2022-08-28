import { createSlice } from "@reduxjs/toolkit";

const theme = localStorage.getItem("theme");

export const themeSlice = createSlice({
  name: "theme",
  initialState: {
    mode: theme ? theme : "light",
  },
  reducers: {
    toDarkMode: (state, action) => {
      state.mode = action.payload ? "dark" : "light";
      localStorage.setItem("theme", state.mode);
    },
  },
});

export const { toDarkMode } = themeSlice.actions;
export default themeSlice.reducer;
