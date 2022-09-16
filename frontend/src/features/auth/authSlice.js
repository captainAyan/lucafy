import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";

const user = JSON.parse(localStorage.getItem("user"));

const initialState = {
  user: user ? user : null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// Register user
export const register = createAsyncThunk(
  "auth/register",
  async (user, thunkAPI) => {
    try {
      return await authService.register(user);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.error.message);
    }
  }
);

// Login user
export const login = createAsyncThunk("auth/login", async (user, thunkAPI) => {
  try {
    return await authService.login(user);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.error.message);
  }
});

// edit profile
export const edit = createAsyncThunk("auth/edit", async (user, thunkAPI) => {
  /**
   * the edit profile feature is in the AUTH feature because this action will
   * alter the USER state
   */
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await authService.edit(user, token);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.error.message);
  }
});

// get profile and update local-storage (syncing user)
export const get = createAsyncThunk("auth/get", async (user, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await authService.get(token);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.error.message);
  }
});

// delete profile
export const deleteAccount = createAsyncThunk(
  "auth/delete",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await authService.deleteAccount(token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.error.message);
    }
  }
);

// logout user
export const logout = createAsyncThunk("auth/logout", async () => {
  await authService.logout();
});

export const authSlice = createSlice({
  name: "auth",
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
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;

        state.message = action.payload;
        state.user = null;
      })

      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;

        state.message = action.payload;
        state.user = null;
      })

      .addCase(edit.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(edit.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        state.user.firstName = action.payload.firstName;
        state.user.lastName = action.payload.lastName;
        state.user.email = action.payload.email;
      })
      .addCase(edit.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;

        state.message = action.payload;
      })

      .addCase(get.fulfilled, (state, action) => {
        state.user.firstName = action.payload.firstName;
        state.user.lastName = action.payload.lastName;
        state.user.email = action.payload.email;
      })

      .addCase(deleteAccount.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteAccount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        state.user = null;
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;

        state.message = action.payload;
      })

      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
