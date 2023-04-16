import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ledgerService from "./ledgerService";

const initialState = {
  ledgers: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  gotAll: false,
  message: "",
};

// create ledger
export const create = createAsyncThunk(
  "ledger/create",
  async (ledger, thunkAPI) => {
    try {
      const { token } = thunkAPI.getState().auth2;
      return await ledgerService.create(ledger, token);
    } catch (error) {
      console.log(error.response.data.error.message);
      return thunkAPI.rejectWithValue(error.response.data.error.message);
    }
  }
);

// get all ledgers
export const getAll = createAsyncThunk("ledger/getAll", async (_, thunkAPI) => {
  try {
    const { token } = thunkAPI.getState().auth2;
    return await ledgerService.getAll(token);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.error.message);
  }
});

// edit ledger
export const edit = createAsyncThunk(
  "ledger/edit",
  async (ledgerEditObject, thunkAPI) => {
    try {
      const { token } = thunkAPI.getState().auth2;
      return await ledgerService.edit(
        ledgerEditObject.id,
        ledgerEditObject.body,
        token
      );
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.error.message);
    }
  }
);

export const ledgerSlice = createSlice({
  name: "ledger",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
    ledgersReset: (state) => {
      /**
       * When logging out from one account and then login using another one, the
       * getAll ledgers system don't work properly. It doesn't remove the stored
       * ledgers of the previous user.
       *
       * This can be fixed by resetting the value of state.gotAll to false on
       * logout.
       */
      state.gotAll = false;
      state.ledgers = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(create.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(create.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        state.ledgers = [action.payload, ...state.ledgers];
      })
      .addCase(create.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;

        state.message = action.payload;
      })

      .addCase(getAll.fulfilled, (state, action) => {
        state.gotAll = true;
        state.ledgers = action.payload.ledgers;
      })

      .addCase(edit.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(edit.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        var newLedgersArray = state.ledgers.map((l) => {
          if (l.id === action.payload.id) {
            return action.payload;
          } else return l;
        });

        state.ledgers = newLedgersArray;
      })
      .addCase(edit.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;

        state.message = action.payload;
      });
  },
});

export const { reset, ledgersReset } = ledgerSlice.actions;
export default ledgerSlice.reducer;
