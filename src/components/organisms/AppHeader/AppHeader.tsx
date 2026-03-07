/**
 * Created by porfidev on 05/03/26
 */

import './AppHeader.styles.css';
import { BrandTitle, Icon, Logo } from '../../atoms';
import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { AdminMenu } from '../AdminMenu';
import { useAuth } from '../../../features/auth/hooks/useAuth.ts';
import { useClickOutside } from '../../../hooks/useOutsideClick.ts';
import { UserMenu } from '../UserMenu';

type HeaderMenu = 'admin' | 'user' | null;
type MenuKey = Exclude<HeaderMenu, null>;
type MenuPosition = { top: number; left: number };

export function AppHeader() {
  const [activeMenu, setActiveMenu] = useState<HeaderMenu>(null);
  const [menuPositions, setMenuPositions] = useState<Record<MenuKey, MenuPosition>>({
    admin: { top: 0, left: 0 },
    user: { top: 0, left: 0 },
  });

  const toggleMenu = (menu: HeaderMenu) => {
    setActiveMenu((prev) => (prev === menu ? null : menu));
  };

  const adminMenuRef = useRef<HTMLDivElement | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const adminButtonRef = useRef<HTMLButtonElement | null>(null);
  const userButtonRef = useRef<HTMLButtonElement | null>(null);
  const menuRefs = {
    admin: adminMenuRef,
    user: userMenuRef,
  };
  const buttonRefs = {
    admin: adminButtonRef,
    user: userButtonRef,
  };
  const activeMenuRef = activeMenu ? menuRefs[activeMenu] : adminMenuRef;

  const updateMenuPosition = (menu: MenuKey) => {
    const button = buttonRefs[menu].current;
    if (!button) return;

    const buttonRect = button.getBoundingClientRect();

    setMenuPositions((previous) => ({
      ...previous,
      [menu]: {
        top: buttonRect.bottom + 10,
        left: buttonRect.left,
      },
    }));
  };

  const onToggleMenu = (menu: MenuKey) => {
    if (activeMenu === menu) {
      setActiveMenu(null);
      return;
    }

    updateMenuPosition(menu);
    setActiveMenu(menu);
  };

  useClickOutside(activeMenuRef, Boolean(activeMenu), () => {
    setActiveMenu(null);
  });

  const { user } = useAuth();

  const isAdmin = user?.is_admin;

  const handleNavigate = () => {
    return toggleMenu(null);
  };

  useEffect(() => {
    if (!activeMenu) return;

    const onViewportChange = () => {
      updateMenuPosition(activeMenu);
    };

    window.addEventListener('resize', onViewportChange);
    window.addEventListener('scroll', onViewportChange, { passive: true });

    return () => {
      window.removeEventListener('resize', onViewportChange);
      window.removeEventListener('scroll', onViewportChange);
    };
  }, [activeMenu, updateMenuPosition]);

  return (
    <header className={'app-header'}>
      <div className={'app-header__brand'}>
        <Logo width={'3rem'} height={'3rem'} />
        <Link className={'app-header__brand-text'} to={'/home'}>
          <BrandTitle main={'Sunday'} highlight={'Picks'} />
        </Link>
      </div>

      <div className={'app-header__actions'}>
        <div className="app-header__menu" ref={userMenuRef}>
          <button
            ref={userButtonRef}
            type={'button'}
            className={`app-header__icon-btn ${activeMenu === 'user' ? 'app-header__icon-btn--active' : ''}`}
            onClick={() => onToggleMenu('user')}
          >
            <Icon name={'account_circle'} size={28} /> Perfil
          </button>

          {activeMenu === 'user' && (
            <UserMenu
              onNavigateAction={handleNavigate}
              top={menuPositions.user.top}
              left={menuPositions.user.left}
            />
          )}
        </div>
        {isAdmin && (
          <div className="app-header__menu" ref={adminMenuRef}>
            <button
              ref={adminButtonRef}
              type={'button'}
              className={`app-header__icon-btn ${activeMenu === 'admin' ? 'app-header__icon-btn--active' : ''}`}
              onClick={() => onToggleMenu('admin')}
            >
              <Icon name={'settings'} size={28} /> Admin
            </button>

            {activeMenu === 'admin' && (
              <AdminMenu
                onNavigateAction={handleNavigate}
                top={menuPositions.admin.top}
                left={menuPositions.admin.left}
              />
            )}
          </div>
        )}
      </div>
    </header>
  );
}
