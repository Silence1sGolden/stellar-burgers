import store, { RootState } from './store';

describe('Тестирование store', () => {
  test('Проверка инициализации rootStore', () => {
    expect(store.getState()).toEqual<RootState>({
      user: {
        isAuthChecked: false,
        userOrders: [],
        user: null,
        loading: false,
        error: null
      },
      feed: {
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
      },
      constructorItems: {
        bun: null,
        ingredients: [],
        orderedBurger: null,
        loading: false,
        error: null
      },
      ingredients: {
        ingredients: [],
        loading: false,
        error: null
      }
    });
  });
});
