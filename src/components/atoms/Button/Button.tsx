import type { ButtonHTMLAttributes } from 'react';
import './Button.styles.css';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ children, className = '', ...props }: ButtonProps) {
  return (
    <button type={'button'} className={`button ${className?.trim()}`} {...props}>
      {children}
    </button>
  );
}
