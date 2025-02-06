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

beforeEach(() => {
  store = configureStore({
    reducer: {
      feed: FeedReducer
    }
  });
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
    afterEach(() => {
      jest.clearAllMocks();
    });

    test('Проверка requestFeeds', async () => {
      jest.spyOn(Api, 'getFeedsApi').mockResolvedValue(expectedFeedsResponse);
      await store.dispatch(requestFeeds());
      expect(store.getState().feed.error).toBe(null);
      expect(store.getState().feed.feed).toEqual(expectedFeedsResponse);
    });

    test('Проверка reqGetOrderByNumber', async () => {
      jest
        .spyOn(Api, 'getOrderByNumberApi')
        .mockResolvedValue(expectedOrderResponse);
      await store.dispatch(reqGetOrderByNumber(1));
      expect(store.getState().feed.orderByNumber).toEqual(expectedOrder);
    });
  });
});
