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

    test('Проверка requestIngredients', async () => {
      jest
        .spyOn(Api, 'getIngredientsApi')
        .mockResolvedValue(expectedIngredientsResponse.data);

      await store.dispatch(requestIngredients());

      expect(store.getState().ingredients.ingredients).toEqual(
        expectedIngredientsResponse.data
      );
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
