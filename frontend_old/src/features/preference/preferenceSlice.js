import { createSlice } from "@reduxjs/toolkit";

import { RUPEE } from "../../constants/currency";
import { INDIAN } from "../../constants/amountFormat";
import { LIGHT } from "../../constants/theme";

const preference = JSON.parse(localStorage.getItem("preference"));

export const preferenceSlice = createSlice({
  name: "preference",
  initialState: {
    amountFormat: preference?.amountFormat || INDIAN,
    currency: preference?.currency || RUPEE,
    theme: preference?.theme || LIGHT,
  },
  reducers: {
    setPreference: (state, action) => {
      state.amountFormat = action.payload.amountFormat;
      state.currency = action.payload.currency;

      localStorage.setItem("preference", JSON.stringify(state));
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem("preference", JSON.stringify(state));
    },
  },
});

export const { setPreference, setTheme } = preferenceSlice.actions;
export default preferenceSlice.reducer;
