import { getFeedsApi, TFeedsResponse } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TFeedSliceInitialState {
  feed: TFeedsResponse;
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
  loading: false,
  error: null
};

export const requestFeeds = createAsyncThunk('orders-all', async () =>
  getFeedsApi()
);

const feedSlice = createSlice({
  name: 'feed',
  initialState: initialState,
  reducers: {},
  selectors: {
    getFeed: (state) => state.feed,
    getFeedLoading: (state) => state.loading,
    getFeedError: (state) => state.error
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
      });
  }
});

export const { getFeed, getFeedLoading, getFeedError } = feedSlice.selectors;
export const FeedReducer = feedSlice.reducer;
