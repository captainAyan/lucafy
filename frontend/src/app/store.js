import { configureStore } from "@reduxjs/toolkit";

import darkModeReducer from "../features/theme/themeSlice";
import authReducer from "../features/auth/authSlice";

export const store = configureStore({
  reducer: {
    theme: darkModeReducer,
    auth: authReducer,
  },
});
