import { configureStore } from "@reduxjs/toolkit";

import preferenceReducer from "../features/preferenceSlice";
import authReducer from "../features/authSlice";

export const store = configureStore({
  reducer: {
    preference: preferenceReducer,
    auth: authReducer,
  },
});
