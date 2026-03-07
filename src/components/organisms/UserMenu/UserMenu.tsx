/**
 * Created by porfidev on 06/03/26
 */

import './UserMenu.styles.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../features/auth/hooks/useAuth.ts';
import { type CSSProperties, useLayoutEffect, useRef, useState } from 'react';
import { Icon } from '../../atoms';

type UserMenuProps = {
  onNavigateAction: () => void;
  top: number;
  left: number;
};

export function UserMenu({ onNavigateAction, top, left }: UserMenuProps) {
  const isActive = (path: string) => location.pathname === path;
  const location = useLocation();
  const navigate = useNavigate();
  const { clearAuthData } = useAuth();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [safeLeft, setSafeLeft] = useState(left);

  useLayoutEffect(() => {
    const menu = menuRef.current;
    if (!menu) {
      return;
    }

    const margin = 12;
    const menuWidth = menu.offsetWidth;
    const maxLeft = Math.max(margin, window.innerWidth - menuWidth - margin);
    const clampedLeft = Math.min(Math.max(left, margin), maxLeft);
    setSafeLeft(clampedLeft);
  }, [left]);

  const onLogout = () => {
    clearAuthData();
    navigate('/', { replace: true });
  };
  const onNavigate = () => {
    if (onNavigateAction) {
      onNavigateAction();
    }
  };

  const menuStyles: CSSProperties = {
    top,
    left: safeLeft,
  };

  return (
    <div ref={menuRef} className={'user-menu'} role={'menu'} style={menuStyles}>
      <section className={'user-menu__menu-section'}>
        <p className={'user-menu__menu-title'}>Ajustes</p>

        <Link
          to={'/change-password'}
          className={`user-menu__menu-item ${isActive('/change-password') ? 'user-menu__menu-item--active' : ''}`}
          onClick={onNavigate}
        >
          <Icon name={'groups'} size={20} />
          <span>Cambiar contraseña</span>
        </Link>
      </section>

      <section className={'user-menu__menu-section'}>
        <button type={'button'} className={'user-menu__menu-item'} onClick={onLogout}>
          <Icon name={'logout'} size={20} />
          <span>Cerrar sesión</span>
        </button>
      </section>
    </div>
  );
}
