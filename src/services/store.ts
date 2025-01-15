import { combineSlices, configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { IngredientsReducer } from '../slices/ingredientsSlice';
import { ConstructorItemsReducer } from '../slices/constructorSlice';
import { AuthReducer } from '../slices/authSlice';
import { FeedReducer } from '../slices/feedSlice';

const rootReducer = {
  ingredients: IngredientsReducer,
  constructorItems: ConstructorItemsReducer,
  user: AuthReducer,
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
