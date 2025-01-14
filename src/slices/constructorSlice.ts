import { orderBurgerApi, TNewOrderResponse } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';

interface TConstructorItems {
  bun: TIngredient | null;
  price: number;
  ingredients: TIngredient[];
  orderedBurger: TOrder | null;
  loading: boolean;
  error: string | null;
}

const initialState: TConstructorItems = {
  bun: null,
  price: 0,
  ingredients: [],
  orderedBurger: null,
  loading: false,
  error: null
};

export const requestOrder = createAsyncThunk(
  'create-order',
  async (data: string[]) => orderBurgerApi(data)
);

const constructorSlice = createSlice({
  name: 'constructor-items',
  initialState: initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      if (action.payload.type === 'bun') {
        state.bun = action.payload;
      } else {
        state.ingredients = [...state.ingredients, action.payload];
      }
    },
    clearOrderBurgerData: (state) => {
      state.orderedBurger = null;
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
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
        (item) => item._id != action.payload._id
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
  clearConstructor,
  clearOrderBurgerData,
  moveUpConstructorIngredient,
  moveDownConstructorIngredient,
  deleteConstructorIngredient
} = constructorSlice.actions;
export const ConstructorItemsReducer = constructorSlice.reducer;
