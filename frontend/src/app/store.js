import { configureStore } from "@reduxjs/toolkit";

import darkModeReducer from "../features/theme/themeSlice";

export const store = configureStore({
  reducer: {
    theme: darkModeReducer,
  },
});
