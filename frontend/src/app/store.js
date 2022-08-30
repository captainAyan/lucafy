import { configureStore } from "@reduxjs/toolkit";

import darkModeReducer from "../features/theme/themeSlice";
import authReducer from "../features/auth/authSlice";
import preferenceReducer from "../features/preference/preferenceSlice";

export const store = configureStore({
  reducer: {
    theme: darkModeReducer,
    auth: authReducer,
    preference: preferenceReducer,
  },
});
