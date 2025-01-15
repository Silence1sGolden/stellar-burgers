import {
  getOrdersApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TAuthResponse,
  TLoginData,
  TRegisterData,
  TUserResponse,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder, TUser } from '@utils-types';
import { deleteCookie, getCookie, setCookie } from '../utils/cookie';

interface TAuthSlice {
  isAuthChecked: boolean;
  user: TUser | null;
  userOrders: TOrder[];
  loading: boolean;
  error: string | null;
}

const initialState: TAuthSlice = {
  isAuthChecked: false,
  userOrders: [],
  user: null,
  loading: false,
  error: null
};

export const updateUserData = createAsyncThunk(
  'user/updateData',
  (data: TRegisterData) => updateUserApi(data)
);

export const requestUserOrders = createAsyncThunk(
  'user/userOrders',
  getOrdersApi
);

export const requestAuth = createAsyncThunk('user/auth', (data: TLoginData) =>
  loginUserApi(data)
);

export const requestRegister = createAsyncThunk(
  'user/registration',
  (data: TRegisterData) => registerUserApi(data)
);

export const getUser = createAsyncThunk('user/getUser', getUserApi);

export const logoutUser = createAsyncThunk('user/logout', logoutApi);

export const checkUserAuth = createAsyncThunk(
  'user/checkUser',
  (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      dispatch(getUser()).finally(() => {
        dispatch(authChecked());
      });
    } else {
      dispatch(authChecked());
    }
  }
);

const authSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    authChecked: (state) => {
      state.isAuthChecked = true;
    }
  },
  selectors: {
    isAuthCheckedSelector: (state) => state.isAuthChecked,
    getUserData: (state) => state.user,
    getAuthLoading: (state) => state.loading,
    getAuthError: (state) => state.error,
    getUserOrders: (state) => state.userOrders
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateUserData.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        updateUserData.fulfilled,
        (state, action: PayloadAction<TUserResponse>) => {
          state.loading = false;
          state.user = action.payload.user;
        }
      )
      .addCase(updateUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message!;
      })

      .addCase(requestAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        requestAuth.fulfilled,
        (state, action: PayloadAction<TAuthResponse>) => {
          state.loading = false;
          state.user = action.payload.user;
        }
      )
      .addCase(requestAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message!;
      })

      .addCase(requestRegister.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        requestRegister.fulfilled,
        (state, action: PayloadAction<TAuthResponse>) => {
          state.loading = false;
          state.user = action.payload.user;
          localStorage.setItem('refreshToken', action.payload.refreshToken);
          setCookie('accessToken', action.payload.accessToken);
        }
      )
      .addCase(requestRegister.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message!;
      })

      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getUser.fulfilled,
        (state, action: PayloadAction<TUserResponse>) => {
          state.loading = false;
          state.user = action.payload.user;
        }
      )
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message!;
      })

      .addCase(requestUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        requestUserOrders.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.loading = false;
          state.userOrders = action.payload;
        }
      )
      .addCase(requestUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message!;
      })

      .addCase(
        logoutUser.fulfilled,
        (state, action: PayloadAction<{ success: boolean }>) => {
          if (action.payload.success) {
            localStorage.removeItem('refreshToken');
            deleteCookie('accessToken');
            state.user = null;
            state.userOrders = [];
          }
        }
      );
  }
});

export const { authChecked } = authSlice.actions;
export const {
  getAuthError,
  getAuthLoading,
  getUserData,
  isAuthCheckedSelector,
  getUserOrders
} = authSlice.selectors;
export const AuthReducer = authSlice.reducer;
