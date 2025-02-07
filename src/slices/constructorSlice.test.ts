import { configureStore } from '@reduxjs/toolkit';
import * as Api from '../utils/burger-api';
import {
  addIngredient,
  clearOrderBurgerData,
  ConstructorItemsReducer,
  deleteConstructorIngredient,
  getOrderBurger,
  getOrderBurgerLoading,
  moveDownConstructorIngredient,
  moveUpConstructorIngredient,
  requestOrder
} from './constructorSlice';
import {
  bunIngredient,
  errorResponse,
  expectedBunIngredient,
  expectedErrorMessage,
  expectedMainIngredient,
  expectedOrder,
  expectedRequestOrder,
  expectedSouceIngredient,
  ingredientsWithId,
  mainIngredient,
  souceIngredient
} from '../utils/mock-data';

jest.mock('../utils/burger-api');

let store = configureStore({
  reducer: {
    constructorItems: ConstructorItemsReducer
  }
});

afterAll(() => {
  jest.resetAllMocks();
});

describe('Проверка constructorSlice', () => {
  describe('Тестирование thunkActions', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    const requestData = ['id_1', 'id_2'];

    test('Проверка requestOrderResolved', async () => {
      jest.spyOn(Api, 'orderBurgerApi').mockImplementation(() => {
        expect(store.getState().constructorItems.loading).toBe(true);
        return Promise.resolve(expectedRequestOrder);
      });

      await store.dispatch(requestOrder(requestData));

      expect(store.getState().constructorItems.error).toBe(null);
      expect(store.getState().constructorItems.loading).toBe(false);
      expect(store.getState().constructorItems.orderedBurger).toEqual(
        expectedOrder
      );
    });

    test('Проверка requestOrderRejected', async () => {
      jest.spyOn(Api, 'orderBurgerApi').mockImplementation(() => {
        expect(store.getState().constructorItems.loading).toBe(true);
        return Promise.reject(errorResponse);
      });

      await store.dispatch(requestOrder(requestData));

      expect(store.getState().constructorItems.error).toBe(
        expectedErrorMessage
      );
      expect(store.getState().constructorItems.loading).toBe(false);
      expect(store.getState().constructorItems.orderedBurger).toEqual(null);
    });
  });

  describe('Тестирование reducers', () => {
    beforeEach(() => {
      store = configureStore({
        reducer: {
          constructorItems: ConstructorItemsReducer
        },
        preloadedState: {
          constructorItems: {
            bun: null,
            ingredients: ingredientsWithId,
            orderedBurger: expectedOrder,
            loading: false,
            error: null
          }
        }
      });
    });

    test('Проверка addIngredient', () => {
      store.dispatch(addIngredient(souceIngredient));
      expect(store.getState().constructorItems.ingredients.length).toBe(3);
      store.dispatch(addIngredient(bunIngredient));
      expect(store.getState().constructorItems.bun).toEqual(
        expectedBunIngredient
      );
      expect(store.getState().constructorItems.ingredients.length).toBe(3);
      store.dispatch(addIngredient(mainIngredient));
      expect(store.getState().constructorItems.ingredients.length).toBe(4);
      expect(store.getState().constructorItems.ingredients).toEqual([
        expectedMainIngredient,
        expectedSouceIngredient,
        expectedSouceIngredient,
        expectedMainIngredient
      ]);
    });

    test('Проверка moveUpConstructorIngredient', () => {
      store.dispatch(moveUpConstructorIngredient(1));
      expect(store.getState().constructorItems.ingredients).toEqual([
        expectedSouceIngredient,
        expectedMainIngredient
      ]);
      store.dispatch(moveUpConstructorIngredient(1));
      expect(store.getState().constructorItems.ingredients).toEqual([
        expectedMainIngredient,
        expectedSouceIngredient
      ]);
    });

    test('Проверка moveDownConstructorIngredient', () => {
      store.dispatch(moveDownConstructorIngredient(0));
      expect(store.getState().constructorItems.ingredients).toEqual([
        expectedSouceIngredient,
        expectedMainIngredient
      ]);
      store.dispatch(moveDownConstructorIngredient(0));
      expect(store.getState().constructorItems.ingredients).toEqual([
        expectedMainIngredient,
        expectedSouceIngredient
      ]);
    });

    test('Проверка deleteConstructorIngredient', () => {
      expect(store.getState().constructorItems.ingredients.length).toBe(2);
      store.dispatch(
        deleteConstructorIngredient(
          store.getState().constructorItems.ingredients[0]
        )
      );
      expect(store.getState().constructorItems.ingredients).toEqual([
        expectedSouceIngredient
      ]);
      store.dispatch(
        deleteConstructorIngredient(
          store.getState().constructorItems.ingredients[0]
        )
      );
      expect(store.getState().constructorItems.ingredients).toEqual([]);
    });

    test('Проверка clearOrderBurgerData', () => {
      expect(store.getState().constructorItems.orderedBurger).toEqual(
        expectedOrder
      );
      store.dispatch(clearOrderBurgerData());
      expect(store.getState().constructorItems.orderedBurger).toBe(null);
    });
  });

  describe('Тестирование selectors', () => {
    beforeEach(() => {
      store = configureStore({
        reducer: {
          constructorItems: ConstructorItemsReducer
        },
        preloadedState: {
          constructorItems: {
            bun: null,
            ingredients: [expectedMainIngredient, expectedSouceIngredient],
            orderedBurger: expectedOrder,
            loading: false,
            error: null
          }
        }
      });
    });

    test('Проверка getOrderBurger', () => {
      const storeOrderedBurdger = getOrderBurger(store.getState());
      expect(storeOrderedBurdger).toEqual(expectedOrder);
    });

    test('Проверка getOrderBurder', () => {
      const storeOrderBurgerLoading = getOrderBurgerLoading(store.getState());
      expect(storeOrderBurgerLoading).toBe(false);
    });
  });
});
