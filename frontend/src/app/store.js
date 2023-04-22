import { configureStore } from "@reduxjs/toolkit";

import preferenceReducer from "../features/preference/preferenceSlice";
import authReducer from "../features/auth/authSlice";

export const store = configureStore({
  reducer: {
    preference: preferenceReducer,
    auth: authReducer,
  },
});
