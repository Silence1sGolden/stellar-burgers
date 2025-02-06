import {
  getFeedsApi,
  getOrderByNumberApi,
  TFeedsResponse,
  TOrderResponse
} from '../utils/burger-api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

interface TFeedSliceInitialState {
  feed: TFeedsResponse;
  orderByNumber: TOrder | null;
  orderByNumberLoading: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: TFeedSliceInitialState = {
  feed: {
    orders: [],
    total: 0,
    success: false,
    totalToday: 0
  },
  orderByNumber: null,
  orderByNumberLoading: false,
  loading: false,
  error: null
};

export const requestFeeds = createAsyncThunk('feed/getAll', getFeedsApi);

export const reqGetOrderByNumber = createAsyncThunk(
  'feed/orderByNumber',
  (data: number) => getOrderByNumberApi(data)
);

const feedSlice = createSlice({
  name: 'feed',
  initialState: initialState,
  reducers: {},
  selectors: {
    getFeed: (state) => state.feed,
    getFeedLoading: (state) => state.loading,
    getFeedError: (state) => state.error,
    getOrderByNumber: (state) => state.orderByNumber,
    getOrderByNumberLoading: (state) => state.loading
  },
  extraReducers: (builder) => {
    builder
      .addCase(requestFeeds.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(
        requestFeeds.fulfilled,
        (state, action: PayloadAction<TFeedsResponse>) => {
          state.loading = false;
          state.feed = action.payload;
        }
      )
      .addCase(requestFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message!;
      })

      .addCase(reqGetOrderByNumber.pending, (state) => {
        state.error = null;
        state.orderByNumberLoading = true;
        state.orderByNumber = null;
      })
      .addCase(
        reqGetOrderByNumber.fulfilled,
        (state, action: PayloadAction<TOrderResponse>) => {
          state.orderByNumberLoading = false;
          state.orderByNumber = action.payload.orders[0];
        }
      )
      .addCase(reqGetOrderByNumber.rejected, (state, action) => {
        state.orderByNumberLoading = false;
        state.error = action.error.message!;
      });
  }
});

export const {
  getFeed,
  getFeedLoading,
  getFeedError,
  getOrderByNumber,
  getOrderByNumberLoading
} = feedSlice.selectors;
export const FeedReducer = feedSlice.reducer;
