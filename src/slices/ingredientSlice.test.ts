import { configureStore } from '@reduxjs/toolkit';
import * as Api from '../utils/burger-api';
import {
  getIngredientById,
  getIngredientLoading,
  getIngredients,
  IngredientsReducer,
  requestIngredients
} from './ingredientsSlice';
import {
  errorResponse,
  expectedErrorMessage,
  expectedIngredientsResponse,
  mainIngredient,
  souceIngredient
} from '../utils/mock-data';

jest.mock('../utils/burger-api');

afterAll(() => {
  jest.clearAllMocks();
});

let store = configureStore({
  reducer: {
    ingredients: IngredientsReducer
  }
});

describe('Тестирование ingredientSlice', () => {
  describe('Тестирование thunkActions', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    beforeEach(() => {
      store = configureStore({
        reducer: {
          ingredients: IngredientsReducer
        }
      });
    });

    test('Проверка requestIngredientsResolved', async () => {
      jest.spyOn(Api, 'getIngredientsApi').mockImplementation(() => {
        expect(store.getState().ingredients.loading).toBe(true);
        return Promise.resolve(expectedIngredientsResponse.data);
      });

      await store.dispatch(requestIngredients());

      expect(store.getState().ingredients.loading).toBe(false);
      expect(store.getState().ingredients.error).toBe(null);
      expect(store.getState().ingredients.ingredients).toEqual(
        expectedIngredientsResponse.data
      );
    });

    test('Проверка requestIngredientsRejected', async () => {
      jest.spyOn(Api, 'getIngredientsApi').mockImplementation(() => {
        expect(store.getState().ingredients.loading).toBe(true);
        return Promise.reject(errorResponse);
      });

      await store.dispatch(requestIngredients());

      expect(store.getState().ingredients.loading).toBe(false);
      expect(store.getState().ingredients.error).toBe(expectedErrorMessage);
      expect(store.getState().ingredients.ingredients).toEqual([]);
    });
  });

  describe('Тестирование selectors', () => {
    beforeEach(() => {
      store = configureStore({
        reducer: {
          ingredients: IngredientsReducer
        },
        preloadedState: {
          ingredients: {
            ingredients: expectedIngredientsResponse.data,
            loading: false,
            error: null
          }
        }
      });
    });

    test('Проверка getIngredients', () => {
      const storeIngredients = getIngredients(store.getState());
      expect(storeIngredients).toEqual(expectedIngredientsResponse.data);
    });

    test('Проверка getIngredientsById', () => {
      const storeIngredientMain = getIngredientById(store.getState(), 'id_542');
      expect(storeIngredientMain).toEqual(mainIngredient);
      const storeIngredientSouce = getIngredientById(
        store.getState(),
        'id_122'
      );
      expect(storeIngredientSouce).toEqual(souceIngredient);
    });

    test('Проверка getIngredientsById', () => {
      const storeIngredientLoading = getIngredientLoading(store.getState());
      expect(storeIngredientLoading).toBe(false);
    });
  });
});
