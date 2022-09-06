import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import preferenceReducer from "../features/preference/preferenceSlice";
import ledgerReducer from "../features/ledger/ledgerSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    preference: preferenceReducer,
    ledger: ledgerReducer,
  },
});
