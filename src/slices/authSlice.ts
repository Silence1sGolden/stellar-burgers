import {
  getOrdersApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TAuthResponse,
  TLoginData,
  TRegisterData,
  TUserResponse
} from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder, TUser } from '@utils-types';
import { deleteCookie, getCookie, setCookie } from '../utils/cookie';

interface TAuthSlice {
  isAuthChecked: boolean;
  user: TUser;
  userOrders: TOrder[];
  loading: boolean;
  error: string | null;
}

const initialState: TAuthSlice = {
  isAuthChecked: false,
  userOrders: [],
  user: {
    email: '',
    name: ''
  },
  loading: false,
  error: null
};

export const requestUserOrders = createAsyncThunk('my-userOrders', async () =>
  getOrdersApi()
);

export const requestAuth = createAsyncThunk(
  'user/Authentification',
  async (data: TLoginData) => loginUserApi(data)
);

export const requestRegister = createAsyncThunk(
  'user/Registration',
  async (data: TRegisterData) => registerUserApi(data)
);

export const getUser = createAsyncThunk('user/getUser', async () =>
  getUserApi()
);

export const logoutUser = createAsyncThunk('user/logout', async () =>
  logoutApi()
);

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
  name: 'auth',
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
      .addCase(requestAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        requestAuth.fulfilled,
        (state, action: PayloadAction<TAuthResponse>) => {
          state.loading = false;
          state.user = action.payload.user;
          localStorage.setItem('refreshToken', action.payload.refreshToken);
          setCookie('accessToken', action.payload.accessToken);
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
            state.user = {
              name: '',
              email: ''
            };
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
