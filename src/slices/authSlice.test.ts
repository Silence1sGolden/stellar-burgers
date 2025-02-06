import { configureStore } from '@reduxjs/toolkit';
import {
  authChecked,
  AuthReducer,
  checkUserAuth,
  getAuthError,
  getAuthLoading,
  getUser,
  getUserData,
  getUserOrders,
  isAuthCheckedSelector,
  logoutUser,
  requestAuth,
  requestRegister,
  requestUserOrders,
  updateUserData
} from './authSlice';
import * as Api from '../utils/burger-api';
import {
  expectedAuthResponse,
  expectedErrorMessage,
  expectedOrder,
  expectedRegisterData,
  expectedUpdatedUser,
  expectedUserData
} from '../utils/mock-data';

jest.mock('../utils/burger-api');

let store = configureStore({
  reducer: {
    user: AuthReducer
  }
});

beforeEach(() => {
  store = configureStore({
    reducer: {
      user: AuthReducer
    }
  });
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe('Тестирование authSlice', () => {
  describe('Тестирование reducers', () => {
    test('Проверка authChecked', () => {
      expect(store.getState().user.isAuthChecked).toBe(false);
      store.dispatch(authChecked());
      expect(store.getState().user.isAuthChecked).toBe(true);
    });
  });

  describe('Тестирование selectors', () => {
    test('Проверка authChecked', () => {
      const authCheckedSelector = isAuthCheckedSelector(store.getState());
      expect(authCheckedSelector).toBe(false);
    });

    test('Проверка getUserData', () => {
      const userWithoutData = getUserData(store.getState());
      expect(userWithoutData).toBe(null);
      store = configureStore({
        reducer: {
          user: AuthReducer
        },
        preloadedState: {
          user: {
            isAuthChecked: false,
            userOrders: [],
            user: expectedUserData,
            loading: false,
            error: null
          }
        }
      });
      const userWithData = getUserData(store.getState());
      expect(userWithData).toEqual(expectedUserData);
    });

    test('Проверка getAuthLoading', () => {
      const authLoadingStatus = getAuthLoading(store.getState());
      expect(authLoadingStatus).toBe(false);
    });

    test('Проверка getAuthError', () => {
      const authNullErrorMessage = getAuthError(store.getState());
      expect(authNullErrorMessage).toBe(null);
      store = configureStore({
        reducer: {
          user: AuthReducer
        },
        preloadedState: {
          user: {
            isAuthChecked: false,
            userOrders: [],
            user: null,
            loading: false,
            error: expectedErrorMessage
          }
        }
      });
      const authErrorMessage = getAuthError(store.getState());
      expect(authErrorMessage).toBe(expectedErrorMessage);
    });

    test('Проверка getUserOrders', () => {
      const userNullOrders = getUserOrders(store.getState());
      expect(userNullOrders).toEqual([]);
      store = configureStore({
        reducer: {
          user: AuthReducer
        },
        preloadedState: {
          user: {
            isAuthChecked: false,
            userOrders: [expectedOrder],
            user: null,
            loading: false,
            error: null
          }
        }
      });
      const userOrders = getUserOrders(store.getState());
      expect(userOrders).toEqual([expectedOrder]);
    });
  });

  describe('Тестирование thunkActions', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    test('Проверка requestAuth', async () => {
      jest.spyOn(Api, 'loginUserApi').mockResolvedValue(expectedAuthResponse);
      await store.dispatch(
        requestAuth({ password: 'some_password', email: 'some_email' })
      );
      expect(store.getState().user.user).toEqual(expectedAuthResponse.user);
    });

    test('Проверка requestRegister', async () => {
      jest
        .spyOn(Api, 'registerUserApi')
        .mockResolvedValue(expectedAuthResponse);
      await store.dispatch(requestRegister(expectedRegisterData));
      expect(store.getState().user.user).toEqual(expectedAuthResponse.user);
    });

    test('Проверка requestUserOrders', async () => {
      jest.spyOn(Api, 'getOrdersApi').mockResolvedValue([expectedOrder]);
      await store.dispatch(requestUserOrders());
      expect(store.getState().user.error).toBe(null);
      expect(store.getState().user.userOrders).toEqual([expectedOrder]);
    });

    test('Проверка updateUserData', async () => {
      store = configureStore({
        reducer: {
          user: AuthReducer
        },
        preloadedState: {
          user: {
            isAuthChecked: false,
            userOrders: [],
            user: {
              email: 'not_updated_email',
              name: 'not_updated_name'
            },
            loading: false,
            error: null
          }
        }
      });
      expect(store.getState().user.user).not.toEqual(expectedUpdatedUser.user);
      jest.spyOn(Api, 'updateUserApi').mockResolvedValue(expectedUpdatedUser);

      await store.dispatch(updateUserData(expectedRegisterData));
      expect(store.getState().user.user).toEqual(expectedUpdatedUser.user);
    });

    test('Проверка checkUserAuth', async () => {
      await store.dispatch(checkUserAuth());
      expect(store.getState().user.isAuthChecked).toBe(true);
    });

    test('Проверка getUser', async () => {
      jest.spyOn(Api, 'getUserApi').mockResolvedValue(expectedAuthResponse);

      await store.dispatch(getUser());

      expect(store.getState().user.error).toBe(null);
      expect(store.getState().user.user).toEqual(expectedUserData);
    });

    test('Проверка logoutUser', async () => {
      store = configureStore({
        reducer: {
          user: AuthReducer
        },
        preloadedState: {
          user: {
            isAuthChecked: false,
            userOrders: [expectedOrder],
            user: {
              email: 'not_updated_email',
              name: 'not_updated_name'
            },
            loading: false,
            error: null
          }
        }
      });

      jest.spyOn(Api, 'logoutApi').mockResolvedValue({ success: true });

      await store.dispatch(logoutUser());

      expect(store.getState().user.user).toBe(null);
      expect(store.getState().user.userOrders).toEqual([]);
    });
  });
});
