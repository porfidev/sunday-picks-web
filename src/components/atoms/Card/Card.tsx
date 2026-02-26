import type { CSSProperties, PropsWithChildren } from 'react';
import './Card.styles.css';

type CardProps = PropsWithChildren & {
  className?: string;
  classNameInner?: string;
  style?: CSSProperties;
};

export function Card({ children, className = '', classNameInner = '', style }: CardProps) {
  return (
    <div className={`card ${className?.trim()}`} style={style}>
      <div className={`card__inner ${classNameInner?.trim()}`}>{children}</div>
    </div>
  );
}
