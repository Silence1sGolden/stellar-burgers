import { getIngredientsApi } from '../utils/burger-api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

interface TIngredientSlice {
  ingredients: TIngredient[];
  loading: boolean;
  error: string | null;
}

export const requestIngredients = createAsyncThunk(
  'ingredients/getAll',
  getIngredientsApi
);

const initialState: TIngredientSlice = {
  ingredients: [],
  loading: false,
  error: null
};

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState: initialState,
  reducers: {},
  selectors: {
    getIngredients: (state) => state.ingredients,
    getIngredientById: (state, id) =>
      state.ingredients.find((item) => item._id === id),
    getIngredientLoading: (state) => state.loading
  },
  extraReducers: (builder) => {
    builder
      .addCase(requestIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        requestIngredients.fulfilled,
        (state, action: PayloadAction<TIngredient[]>) => {
          state.loading = false;
          state.ingredients = action.payload;
        }
      )
      .addCase(requestIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message!;
      });
  }
});

export const { getIngredients, getIngredientById, getIngredientLoading } =
  ingredientsSlice.selectors;
export const IngredientsReducer = ingredientsSlice.reducer;
