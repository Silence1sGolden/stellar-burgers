import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  requestAuth,
  getAuthLoading,
  getAuthError
} from '../../slices/authSlice';
import { Preloader } from '@ui';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const loading = useSelector(getAuthLoading);
  const error = useSelector(getAuthError);

  useEffect(() => {
    const localEmail = localStorage.getItem('ste-bur:email');
    if (localEmail) setEmail(localEmail);
  }, []);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    localStorage.setItem('ste-bur:email', email);

    if (email && password) {
      dispatch(requestAuth({ email, password }));
    }
  };

  if (loading) {
    return <Preloader />;
  }

  return (
    <LoginUI
      errorText={error ? error : ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
