import { FC, useMemo } from 'react';
import { TIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  clearConstructor,
  getConstructorItems,
  requestOrder
} from '../../slices/constructorSlice';
import { clearOrder, getOrder, getOrderLoading } from '../../slices/orderSlice';
import { getUserData } from '../../slices/authSlice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const constructorItems = useSelector(getConstructorItems);
  const user = useSelector(getUserData);

  const orderRequest = useSelector(getOrderLoading);

  const orderModalData = useSelector(getOrder);

  const onOrderClick = () => {
    if (!constructorItems.bun) return;
    console.log(user.name);
    if (!user.name || !user.email) {
      console.log('navigate');
      navigate('/login');
    }
    console.log('not navigate');
    dispatch(
      requestOrder(constructorItems.ingredients.map((item) => item._id))
    );
  };

  const closeOrderModal = () => {
    dispatch(clearOrder());
    dispatch(clearConstructor());
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
