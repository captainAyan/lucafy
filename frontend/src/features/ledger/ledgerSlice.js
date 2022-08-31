import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ledgerService from "./ledgerService";

const initialState = {
  ledgers: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// create ledger
export const create = createAsyncThunk(
  "ledger/create",
  async (ledger, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
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
    const token = thunkAPI.getState().auth.user.token;
    return await ledgerService.getAll(token);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.error.message);
  }
});

// get one ledger
export const getOne = createAsyncThunk(
  "ledger/getOne",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await ledgerService.getOne(id, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.error.message);
    }
  }
);

// edit ledger
export const edit = createAsyncThunk(
  "ledger/edit",
  async (ledger, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await ledgerService.edit(ledger, token);
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(create.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(create.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        state.ledgers = [...state.ledgers, action.payload];
      })
      .addCase(create.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;

        state.message = action.payload;
      });
  },
});

export const { reset } = ledgerSlice.actions;
export default ledgerSlice.reducer;
