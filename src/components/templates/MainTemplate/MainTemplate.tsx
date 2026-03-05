/**
 * Created by porfidev on 16/02/26
 */

import './MainTemplate.styles.css';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BrandTitle, Icon, Logo } from '../../atoms';
import { useAuth } from '../../../features/auth/hooks/useAuth.ts';

type MainTemplateProps = {
  children: ReactNode;
};

export function MainTemplate({ children }: MainTemplateProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { clearAuthData } = useAuth();

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const onClickOutside = (event: MouseEvent) => {
      if (!menuRef.current) {
        return;
      }

      if (!menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('mousedown', onClickOutside);
    window.addEventListener('keydown', onEscape);

    return () => {
      window.removeEventListener('mousedown', onClickOutside);
      window.removeEventListener('keydown', onEscape);
    };
  }, [isMenuOpen]);

  const isActive = (path: string) => location.pathname === path;

  const onLogout = () => {
    clearAuthData();
    navigate('/', { replace: true });
  };

  const onNavigate = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className={'main-template'}>
      <header className={'main-template__header'}>
        <div className={'main-template__brand'}>
          <Logo width={'3rem'} height={'3rem'} />
          <Link className={'main-template__brand-text'} to={'/home'}>
            <BrandTitle main={'Sunday'} highlight={'Picks'} />
          </Link>
        </div>

        <div className={'main-template__actions'} ref={menuRef}>
          <button type={'button'} className={'main-template__icon-btn'}>
            <Icon name={'notifications_none'} size={28} />
          </button>

          <button
            type={'button'}
            className={`main-template__icon-btn ${isMenuOpen ? 'main-template__icon-btn--active' : ''}`}
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <Icon name={'account_circle'} size={28} />
          </button>

          {isMenuOpen && (
            <div className={'main-template__menu'} role={'menu'}>
              <section className={'main-template__menu-section'}>
                <p className={'main-template__menu-title'}>Catálogos</p>

                <Link
                  to={'/admin/teams'}
                  className={`main-template__menu-item ${isActive('/admin/teams') ? 'main-template__menu-item--active' : ''}`}
                  onClick={onNavigate}
                >
                  <Icon name={'groups'} size={24} />
                  <span>Equipos</span>
                </Link>

                <Link
                  to={'/admin/weeks'}
                  className={`main-template__menu-item ${isActive('/admin/weeks') ? 'main-template__menu-item--active' : ''}`}
                  onClick={onNavigate}
                >
                  <Icon name={'calendar_month'} size={24} />
                  <span>Semanas</span>
                </Link>

                <Link
                  to={'/admin/seasons'}
                  className={`main-template__menu-item ${isActive('/admin/seasons') ? 'main-template__menu-item--active' : ''}`}
                  onClick={onNavigate}
                >
                  <Icon name={'event'} size={24} />
                  <span>Temporadas</span>
                </Link>

                <Link
                  to={'/admin/games'}
                  className={`main-template__menu-item ${isActive('/admin/games') ? 'main-template__menu-item--active' : ''}`}
                  onClick={onNavigate}
                >
                  <Icon name={'sports_football'} size={24} />
                  <span>Partidos</span>
                </Link>
              </section>

              <section className={'main-template__menu-section'}>
                <p className={'main-template__menu-title'}>Usuarios</p>
                <Link
                  to={'/admin/users'}
                  className={`main-template__menu-item ${isActive('/admin/users') ? 'main-template__menu-item--active' : ''}`}
                  onClick={onNavigate}
                >
                  <Icon name={'manage_accounts'} size={24} />
                  <span>Administrar usuarios</span>
                </Link>
              </section>

              <section className={'main-template__menu-section'}>
                <button type={'button'} className={'main-template__menu-item'} onClick={onLogout}>
                  <Icon name={'logout'} size={24} />
                  <span>Cerrar sesión</span>
                </button>
              </section>
            </div>
          )}
        </div>
      </header>

      <div className={'main-template__content'}>{children}</div>
    </div>
  );
}
