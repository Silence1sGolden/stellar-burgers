import { configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { RootReducer } from '../slices/ingredientsSlice';
import { ConstructorItemsReducer } from '../slices/constructorSlice';
import { OrderReducer } from '../slices/orderSlice';
import { AuthReducer } from '../slices/authSlice';
import { FeedReducer } from '../slices/feedSlice';

const rootReducer = {
  ingredients: RootReducer,
  'constructor-items': ConstructorItemsReducer,
  order: OrderReducer,
  auth: AuthReducer,
  feed: FeedReducer
}; // Заменить на импорт настоящего редьюсера

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
