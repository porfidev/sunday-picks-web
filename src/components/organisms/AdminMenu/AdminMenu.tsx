/**
 * Created by porfidev on 05/03/26
 */

import './AdminMenu.styles.css';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../features/auth/hooks/useAuth.ts';
import { Icon } from '../../atoms';
import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react';

type AdminMenuProps = {
  onNavigateAction: () => void;
  top: number;
  left: number;
};

export function AdminMenu({ onNavigateAction, top, left }: AdminMenuProps) {
  const isActive = (path: string) => location.pathname === path;
  const location = useLocation();
  const { user } = useAuth();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [safeLeft, setSafeLeft] = useState(left);

  useLayoutEffect(() => {
    if (!user?.is_admin) return;

    const menu = menuRef.current;
    if (!menu) return;

    const margin = 12;
    const menuWidth = menu.offsetWidth;
    const maxLeft = Math.max(margin, window.innerWidth - menuWidth - margin);
    const clampedLeft = Math.min(Math.max(left, margin), maxLeft);

    setSafeLeft(clampedLeft);
  }, [left, user?.is_admin]);

  if (!user?.is_admin) {
    return null;
  }

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
    <div ref={menuRef} className={'admin-menu'} role={'menu'} style={menuStyles}>
      <section className={'admin-menu__menu-section'}>
        <p className={'admin-menu__menu-title'}>Catálogos</p>

        <Link
          to={'/admin/teams'}
          className={`admin-menu__menu-item ${isActive('/admin/teams') ? 'admin-menu__menu-item--active' : ''}`}
          onClick={onNavigate}
        >
          <Icon name={'groups'} size={20} />
          <span>Equipos</span>
        </Link>

        <Link
          to={'/admin/seasons'}
          className={`admin-menu__menu-item ${isActive('/admin/seasons') ? 'admin-menu__menu-item--active' : ''}`}
          onClick={onNavigate}
        >
          <Icon name={'event'} size={20} />
          <span>Temporadas</span>
        </Link>

        <Link
          to={'/admin/weeks'}
          className={`admin-menu__menu-item ${isActive('/admin/weeks') ? 'admin-menu__menu-item--active' : ''}`}
          onClick={onNavigate}
        >
          <Icon name={'calendar_month'} size={20} />
          <span>Semanas</span>
        </Link>
      </section>
      <section className={'admin-menu__menu-section'}>
        <p className={'admin-menu__menu-title'}>Capturas</p>

        <Link
          to={'/admin/games'}
          className={`admin-menu__menu-item ${isActive('/admin/games') ? 'admin-menu__menu-item--active' : ''}`}
          onClick={onNavigate}
        >
          <Icon name={'sports_football'} size={20} />
          <span>Partidos</span>
        </Link>

        <Link
          to={'/admin/game-results'}
          className={`admin-menu__menu-item ${isActive('/admin/game-results') ? 'admin-menu__menu-item--active' : ''}`}
          onClick={onNavigate}
        >
          <Icon name={'scoreboard'} size={20} />
          <span>Resultados</span>
        </Link>
      </section>

      <section className={'admin-menu__menu-section'}>
        <p className={'admin-menu__menu-title'}>Usuarios</p>

        <Link
          to={'/admin/users'}
          className={`admin-menu__menu-item ${isActive('/admin/users') ? 'admin-menu__menu-item--active' : ''}`}
          onClick={onNavigate}
        >
          <Icon name={'manage_accounts'} size={20} />
          <span>Administrar usuarios</span>
        </Link>
      </section>
    </div>
  );
}
