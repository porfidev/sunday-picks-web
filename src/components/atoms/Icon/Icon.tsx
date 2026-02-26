import type { CSSProperties } from 'react';
import './Icon.styles.css';

type IconProps = {
  name: string;
  color?: string;
  size?: number | string;
  className?: string;
  ariaLabel?: string;
};

export function Icon({ name, color, size, className = '', ariaLabel }: IconProps) {
  const style: CSSProperties = {};

  if (color) style.color = color;
  if (size) style.fontSize = typeof size === 'number' ? `${size}px` : size;

  return (
    <span
      className={`icon material-icons ${className?.trim()}`.trim()}
      style={style}
      aria-hidden={ariaLabel ? undefined : 'true'}
      aria-label={ariaLabel}
    >
      {name}
    </span>
  );
}
