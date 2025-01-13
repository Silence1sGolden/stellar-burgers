import {
  getOrderByNumberApi,
  orderBurgerApi,
  TNewOrderResponse,
  TOrderResponse
} from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

interface TOrderSliceInitialState {
  order: TOrder | null;
  loading: boolean;
  error: string | null;
}

export const reqGetOrderByNumber = createAsyncThunk(
  'order-by-number',
  async (data: number) => getOrderByNumberApi(data)
);

const initialState: TOrderSliceInitialState = {
  order: null,
  loading: false,
  error: null
};

const orderSlice = createSlice({
  name: 'order',
  initialState: initialState,
  reducers: {
    clearOrder: (state) => {
      state.order = null;
    }
  },
  selectors: {
    getOrder: (state) => state.order,
    getOrderLoading: (state) => state.loading,
    getOrderError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(reqGetOrderByNumber.pending, (state) => {
        state.error = null;
        state.loading = true;
        state.order = null;
      })
      .addCase(
        reqGetOrderByNumber.fulfilled,
        (state, action: PayloadAction<TOrderResponse>) => {
          state.loading = false;
          state.order = action.payload.orders[0];
        }
      )
      .addCase(reqGetOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message!;
      });
  }
});

export const { clearOrder } = orderSlice.actions;
export const { getOrder, getOrderLoading, getOrderError } =
  orderSlice.selectors;
export const OrderReducer = orderSlice.reducer;
