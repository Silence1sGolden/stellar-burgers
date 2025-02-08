import { ReactElement, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import {
  checkUserAuth,
  getUserData,
  isAuthCheckedSelector
} from '../../slices/authSlice';
import { Preloader } from '@ui';

type ProtectedRouteProps = {
  OnlyOnAuth?: boolean;
  children: ReactElement;
};

export function ProtectedRoute({ children, OnlyOnAuth }: ProtectedRouteProps) {
  const dispatch = useDispatch();
  const location = useLocation();
  const isAuthChecked = useSelector(isAuthCheckedSelector);
  const user = useSelector(getUserData);

  if (!isAuthChecked) {
    dispatch(checkUserAuth());
  }

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!user && !OnlyOnAuth) {
    console.log(location);
    return <Navigate replace state={{ from: location }} to='/login' />;
  }

  if (user && OnlyOnAuth) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  return children;
}
