import React, { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { Link, useLocation } from 'react-router-dom';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const location = useLocation();

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <Link
            to='/'
            className={
              location.pathname === '/'
                ? `${styles.link} ${styles.link_active}`
                : styles.link
            }
          >
            <BurgerIcon type={'primary'} />
            <p className='text text_type_main-default ml-2 mr-10'>
              Конструктор
            </p>
          </Link>
          <Link
            to='/feed'
            className={
              location.pathname === '/feed'
                ? `${styles.link} ${styles.link_active}`
                : styles.link
            }
          >
            <ListIcon type={'primary'} />
            <p data-cy='feed' className='text text_type_main-default ml-2'>
              Лента заказов
            </p>
          </Link>
        </div>
        <div className={styles.logo}>
          <Logo className='' />
        </div>
        <div
          className={
            location.pathname === '/profile'
              ? `${styles.link} ${styles.link_active}`
              : styles.link
          }
        >
          <Link to='/profile' className={styles.link}>
            <ProfileIcon type={'primary'} />
            <p data-cy='username' className='text text_type_main-default ml-2'>
              {userName || 'Личный кабинет'}
            </p>
          </Link>
        </div>
      </nav>
    </header>
  );
};
