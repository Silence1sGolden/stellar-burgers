import { orderBurgerApi, TNewOrderResponse } from '../utils/burger-api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';
import { v4 as uuidv4 } from 'uuid';

export interface TIngredientPayload extends TIngredient {
  id: string;
}

export interface TConstructorItems {
  bun: TIngredient | null;
  ingredients: TIngredientPayload[];
  orderedBurger: TOrder | null;
  loading: boolean;
  error: string | null;
}

const initialState: TConstructorItems = {
  bun: null,
  ingredients: [],
  orderedBurger: null,
  loading: false,
  error: null
};

export const requestOrder = createAsyncThunk(
  'constructorItems/createOrder',
  async (data: string[]) => orderBurgerApi(data)
);

const constructorSlice = createSlice({
  name: 'constructorItems',
  initialState: initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TIngredientPayload>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients = [...state.ingredients, action.payload];
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: uuidv4() }
      })
    },
    clearOrderBurgerData: (state) => {
      state.orderedBurger = null;
    },
    moveUpConstructorIngredient: (state, action: PayloadAction<number>) => {
      const currentIndex = action.payload;
      const currentElem = state.ingredients[currentIndex];
      const targetIndex = currentIndex === 0 ? 0 : currentIndex - 1;
      const targetElem = state.ingredients[targetIndex];

      state.ingredients = state.ingredients.map((item, index) => {
        if (index === currentIndex) return targetElem;
        if (index === targetIndex) return currentElem;
        return item;
      });
    },
    moveDownConstructorIngredient: (state, action: PayloadAction<number>) => {
      const ingredientsLastElemIndex = state.ingredients.length - 1;

      const currentIndex = action.payload;
      const currentElem = state.ingredients[currentIndex];
      const targetIndex =
        currentIndex === ingredientsLastElemIndex
          ? ingredientsLastElemIndex
          : currentIndex + 1;
      const targetElem = state.ingredients[targetIndex];

      state.ingredients = state.ingredients.map((item, index) => {
        if (index === currentIndex) return targetElem;
        if (index === targetIndex) return currentElem;
        return item;
      });
    },
    deleteConstructorIngredient: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id != action.payload.id
      );
    }
  },
  selectors: {
    getConstructorState: (state) => state,
    getOrderBurger: (state) => state.orderedBurger,
    getOrderBurgerLoading: (state) => state.loading
  },
  extraReducers: (builder) => {
    builder
      .addCase(requestOrder.pending, (state) => {
        state.error = null;
        state.orderedBurger = null;
        state.loading = true;
      })
      .addCase(
        requestOrder.fulfilled,
        (state, action: PayloadAction<TNewOrderResponse>) => {
          state.loading = false;
          state.orderedBurger = action.payload.order;
          state.ingredients = [];
          state.bun = null;
        }
      )
      .addCase(requestOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message!;
      });
  }
});

export const { getConstructorState, getOrderBurgerLoading, getOrderBurger } =
  constructorSlice.selectors;
export const {
  addIngredient,
  clearOrderBurgerData,
  moveUpConstructorIngredient,
  moveDownConstructorIngredient,
  deleteConstructorIngredient
} = constructorSlice.actions;
export const ConstructorItemsReducer = constructorSlice.reducer;
