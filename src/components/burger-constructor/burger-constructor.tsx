import { FC, useMemo } from 'react';
import { TIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  clearConstructor,
  clearOrderBurgerData,
  getConstructorState,
  getOrderBurger,
  getOrderBurgerLoading,
  requestOrder
} from '../../slices/constructorSlice';
import { getUserData } from '../../slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { requestFeeds } from '../../slices/feedSlice';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const constructorItems = useSelector(getConstructorState);
  const user = useSelector(getUserData);

  const orderRequest = useSelector(getOrderBurgerLoading);

  const orderModalData = useSelector(getOrderBurger);

  const onOrderClick = () => {
    if (!constructorItems.bun) return;

    if (!user) {
      navigate('/login');
    } else {
      dispatch(
        requestOrder(constructorItems.ingredients.map((item) => item._id))
      );
    }
  };

  const closeOrderModal = () => {
    if (!orderRequest) {
      dispatch(requestFeeds());
      dispatch(clearOrderBurgerData());
      dispatch(clearConstructor());
    }
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
