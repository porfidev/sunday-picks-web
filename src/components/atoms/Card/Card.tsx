import type { ReactNode } from 'react';
import './Card.styles.css';

type CardProps = {
  children: ReactNode;
};

export function Card({ children }: CardProps) {
  return (
    <div className={'card'}>
      <div className={'card__inner'}>{children}</div>
    </div>
  );
}
