import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { signup, signin, logout } from '../user/userService';

const userFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;


export const signupUser = createAsyncThunk(
  'user/signup',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await signup(userData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const signinUser = createAsyncThunk(
  'user/signin',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await signin(userData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logout();
      localStorage.removeItem('userInfo'); 
      return true;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userInfo: userFromStorage,
    token:null,
    loading: false,
    error: null,
  },
  reducers: {
    clearUser: (state) => {
      state.userInfo = null;
      localStorage.removeItem('userInfo');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        localStorage.setItem('userInfo', JSON.stringify(action.payload));
      })
      .addCase(signupUser.rejected, (state, action) => {` `
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(signinUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signinUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.token = action.payload.token;
        localStorage.setItem('userInfo', JSON.stringify(action.payload));
      })
      .addCase(signinUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.userInfo = null;
        state.token=null 
        localStorage.removeItem('userInfo');
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearUser, clearError } = userSlice.actions;
export default userSlice.reducer;
