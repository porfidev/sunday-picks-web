/**
 * Created by porfidev on 16/02/26
 */

import './Label.styles.css';
import type { LabelHTMLAttributes, ReactNode } from 'react';

type LabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
  children: ReactNode;
  required?: boolean;
  variant?: 'default' | 'checkbox';
};

export function Label({ children, required, variant = 'default', ...props }: LabelProps) {
  return (
    <label className={`label ${variant !== 'default' ? `label--${variant}` : ''}`} {...props}>
      {children}
      {required && <span className={'label__required'}>*</span>}
    </label>
  );
}
