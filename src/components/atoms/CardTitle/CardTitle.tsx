/**
 * Created by porfidev on 23/02/26
 */

import './CardTitle.styles.css';
import type { ReactNode } from 'react';

type CardTitleProps = {
  children: ReactNode;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
};

export function CardTitle({ children, icon, iconPosition = 'left' }: CardTitleProps) {
  const iconNode = icon ? <span className={'card-title__icon'}>{icon}</span> : null;

  return (
    <h2 className={'card-title'}>
      {iconPosition === 'left' ? iconNode : null}
      <span className={'card-title__text'}>{children}</span>
      {iconPosition === 'right' ? iconNode : null}
    </h2>
  );
}
