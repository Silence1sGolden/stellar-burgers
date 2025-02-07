import { configureStore } from '@reduxjs/toolkit';
import {
  FeedReducer,
  getFeed,
  getFeedError,
  getFeedLoading,
  getOrderByNumber,
  getOrderByNumberLoading,
  reqGetOrderByNumber,
  requestFeeds
} from './feedSlice';
import {
  errorResponse,
  expectedErrorMessage,
  expectedFeedsResponse,
  expectedOrder,
  expectedOrderResponse
} from '../utils/mock-data';
jest.mock('../utils/burger-api');
import * as Api from '../utils/burger-api';

let store = configureStore({
  reducer: {
    feed: FeedReducer
  }
});

afterAll(() => {
  jest.clearAllMocks();
});

describe('Тестирование feedSlice', () => {
  describe('Тестирование selectors', () => {
    beforeEach(() => {
      store = configureStore({
        reducer: {
          feed: FeedReducer
        },
        preloadedState: {
          feed: {
            feed: expectedFeedsResponse,
            orderByNumber: expectedOrder,
            orderByNumberLoading: false,
            loading: false,
            error: expectedErrorMessage
          }
        }
      });
    });

    test('Проверка getFeed', () => {
      const storeFeed = getFeed(store.getState());
      expect(storeFeed).toEqual(expectedFeedsResponse);
    });

    test('Проверка getFeedLoading', () => {
      const storeFeedLoading = getFeedLoading(store.getState());
      expect(storeFeedLoading).toBe(false);
    });

    test('Проверка getFeedError', () => {
      const storeFeedError = getFeedError(store.getState());
      expect(storeFeedError).toBe(expectedErrorMessage);
    });

    test('Проверка getOrderByNumber', () => {
      const storeOrderByNumber = getOrderByNumber(store.getState());
      expect(storeOrderByNumber).toEqual(expectedOrder);
    });

    test('Проверка getOrderByNumberLoading', () => {
      const storeOrderByNumberLoading = getOrderByNumberLoading(
        store.getState()
      );
      expect(storeOrderByNumberLoading).toBe(false);
    });
  });

  describe('Тестирование thunkActions', () => {
    beforeEach(() => {
      store = configureStore({
        reducer: {
          feed: FeedReducer
        }
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test('Проверка requestFeedsResolved', async () => {
      jest.spyOn(Api, 'getFeedsApi').mockImplementation(() => {
        expect(store.getState().feed.loading).toBe(true);
        return Promise.resolve(expectedFeedsResponse);
      });
      await store.dispatch(requestFeeds());
      expect(store.getState().feed.error).toBe(null);
      expect(store.getState().feed.loading).toBe(false);
      expect(store.getState().feed.feed).toEqual(expectedFeedsResponse);
    });

    test('Проверка requestFeedsRejected', async () => {
      jest.spyOn(Api, 'getFeedsApi').mockImplementation(() => {
        expect(store.getState().feed.loading).toBe(true);
        return Promise.reject(errorResponse);
      });
      await store.dispatch(requestFeeds());
      expect(store.getState().feed.error).toBe(expectedErrorMessage);
      expect(store.getState().feed.loading).toBe(false);
      expect(store.getState().feed.feed).toEqual({
        orders: [],
        total: 0,
        success: false,
        totalToday: 0
      });
    });

    test('Проверка reqGetOrderByNumberResolved', async () => {
      jest.spyOn(Api, 'getOrderByNumberApi').mockImplementation(() => {
        expect(store.getState().feed.orderByNumberLoading).toBe(true);
        return Promise.resolve(expectedOrderResponse);
      });
      await store.dispatch(reqGetOrderByNumber(1));
      expect(store.getState().feed.orderByNumber).toEqual(expectedOrder);
      expect(store.getState().feed.error).toBe(null);
      expect(store.getState().feed.orderByNumberLoading).toBe(false);
    });

    test('Проверка reqGetOrderByNumberRejected', async () => {
      jest.spyOn(Api, 'getOrderByNumberApi').mockImplementation(() => {
        expect(store.getState().feed.orderByNumberLoading).toBe(true);
        return Promise.reject(errorResponse);
      });
      await store.dispatch(reqGetOrderByNumber(1));
      expect(store.getState().feed.error).toBe(expectedErrorMessage);
      expect(store.getState().feed.orderByNumberLoading).toBe(false);
      expect(store.getState().feed.orderByNumber).toEqual(null);
    });
  });
});
