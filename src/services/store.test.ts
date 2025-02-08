import { rootStoreInitialState } from '../utils/mock-data';
import store, { RootState } from './store';

describe('Тестирование store', () => {
  test('Проверка инициализации rootStore', () => {
    expect(store.getState()).toEqual<RootState>(rootStoreInitialState);
  });

  test('Проверка неизвестных actions в rootStore', async () => {
    await store.dispatch({ type: 'UNKNOWN_ACTION' });
    expect(store.getState()).toEqual<RootState>(rootStoreInitialState);
  });
});
