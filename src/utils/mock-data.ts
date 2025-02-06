import {
  TAuthResponse,
  TFeedsResponse,
  TIngredientsResponse,
  TNewOrderResponse,
  TOrderResponse,
  TRegisterData,
  TUserResponse
} from '@api';
import { TIngredient, TOrder, TUser } from '@utils-types';

export const ingredientsWithId = [
  {
    _id: 'id_542',
    id: 'some_id542',
    name: 'some_main',
    type: 'main',
    proteins: 65,
    fat: 62,
    carbohydrates: 96,
    calories: 42,
    price: 538,
    image: 'some_url',
    image_large: 'some_url',
    image_mobile: 'some_url'
  },
  {
    _id: 'id_122',
    id: 'some_id123',
    name: 'some_souce',
    type: 'souce',
    proteins: 12,
    fat: 50,
    carbohydrates: 10,
    calories: 17,
    price: 1350,
    image: 'some_url',
    image_large: 'some_url',
    image_mobile: 'some_url'
  }
];

export const mainIngredient: TIngredient = {
  _id: 'id_542',
  name: 'some_main',
  type: 'main',
  proteins: 65,
  fat: 62,
  carbohydrates: 96,
  calories: 42,
  price: 538,
  image: 'some_url',
  image_large: 'some_url',
  image_mobile: 'some_url'
};

export const souceIngredient: TIngredient = {
  _id: 'id_122',
  name: 'some_souce',
  type: 'souce',
  proteins: 12,
  fat: 50,
  carbohydrates: 10,
  calories: 17,
  price: 1350,
  image: 'some_url',
  image_large: 'some_url',
  image_mobile: 'some_url'
};

export const bunIngredient: TIngredient = {
  _id: 'id_123',
  name: 'some_bun',
  type: 'bun',
  proteins: 20,
  fat: 150,
  carbohydrates: 200,
  calories: 31,
  price: 5201,
  image: 'some_url',
  image_large: 'some_url',
  image_mobile: 'some_url'
};

export const expectedMainIngredient = {
  _id: 'id_542',
  id: expect.any(String),
  name: 'some_main',
  type: 'main',
  proteins: 65,
  fat: 62,
  carbohydrates: 96,
  calories: 42,
  price: 538,
  image: 'some_url',
  image_large: 'some_url',
  image_mobile: 'some_url'
};

export const expectedSouceIngredient = {
  _id: 'id_122',
  id: expect.any(String),
  name: 'some_souce',
  type: 'souce',
  proteins: 12,
  fat: 50,
  carbohydrates: 10,
  calories: 17,
  price: 1350,
  image: 'some_url',
  image_large: 'some_url',
  image_mobile: 'some_url'
};

export const expectedBunIngredient = {
  _id: 'id_123',
  id: expect.any(String),
  name: 'some_bun',
  type: 'bun',
  proteins: 20,
  fat: 150,
  carbohydrates: 200,
  calories: 31,
  price: 5201,
  image: 'some_url',
  image_large: 'some_url',
  image_mobile: 'some_url'
};

export const expectedOrder: TOrder = {
  _id: 'id_542',
  name: 'super burger',
  status: 'some_status',
  createdAt: 'created_time',
  updatedAt: 'updated_time',
  number: 1,
  ingredients: ['id_1', 'id_2']
};

export const expectedRequestOrder: TNewOrderResponse = {
  name: 'some_name',
  order: expectedOrder,
  success: true
};

export const expectedUserData: TUser = {
  email: 'some_email@yandex.ru',
  name: 'some_name'
};

export const expectedRegisterData: TRegisterData = {
  email: 'some_email@yandex.ru',
  name: 'some_name',
  password: 'some_password'
};

export const expectedAuthResponse: TAuthResponse = {
  success: true,
  refreshToken: 'some_refresh_token',
  accessToken: 'some_access_token',
  user: expectedUserData
};

export const expectedUpdatedUser: TUserResponse = {
  success: true,
  user: expectedUserData
};

export const expectedErrorMessage: string = 'Some error Message';

export const expectedFeedsResponse: TFeedsResponse = {
  orders: [expectedOrder],
  total: 1,
  success: true,
  totalToday: 1
};

export const expectedOrderResponse: TOrderResponse = {
  success: true,
  orders: [expectedOrder]
};

export const expectedIngredientsResponse: TIngredientsResponse = {
  success: true,
  data: [bunIngredient, mainIngredient, souceIngredient]
};
