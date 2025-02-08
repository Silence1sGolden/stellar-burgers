import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getUserOrders, requestUserOrders } from '../../slices/authSlice';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(getUserOrders);

  useEffect(() => {
    dispatch(requestUserOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
