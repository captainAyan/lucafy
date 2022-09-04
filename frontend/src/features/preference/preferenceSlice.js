import { createSlice } from "@reduxjs/toolkit";

import { RUPEE } from "../../constants/currency";
import { INDIAN } from "../../constants/amountFormat";

const preference = JSON.parse(localStorage.getItem("preference"));

export const preferenceSlice = createSlice({
  name: "theme",
  initialState: {
    amountFormat: preference?.amountFormat || INDIAN,
    currency: preference?.currency || RUPEE,
  },
  reducers: {
    setPreference: (state, action) => {
      state.amountFormat = action.payload.amountFormat;
      state.currency = action.payload.currency;

      localStorage.setItem("preference", JSON.stringify(state));
    },
  },
});

export const { setPreference } = preferenceSlice.actions;
export default preferenceSlice.reducer;
